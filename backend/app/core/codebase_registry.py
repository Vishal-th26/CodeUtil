"""
Per-user in-memory session store: engine + sliding expiry + daily quota.
NOTE: single-process only.
"""
import threading
from dataclasses import dataclass
from datetime import datetime, timedelta, date

SESSION_TTL = timedelta(hours=2)   # idle timeout, refreshed on each request
DAILY_REQUEST_LIMIT = 10


class SessionNotFound(Exception):
    pass


class SessionExpired(Exception):
    pass


class DailyLimitExceeded(Exception):
    def __init__(self, used: int):
        self.used = used


@dataclass
class Session:
    faiss_store: object
    bm25_store: object
    all_chunks: list
    metadata: list
    created_at: datetime
    last_active: datetime
    request_date: date
    request_count: int = 0


_sessions: dict[str, Session] = {}
_lock = threading.Lock()


def _expired(session: Session, now: datetime) -> bool:
    return now - session.last_active > SESSION_TTL


def create_session(user_id: str, engine: dict) -> None:
    now = datetime.utcnow()
    with _lock:
        _sessions[user_id] = Session(
            faiss_store=engine["faiss_store"],
            bm25_store=engine["bm25_store"],
            all_chunks=engine["all_chunks"],
            metadata=engine["metadata"],
            created_at=now,
            last_active=now,
            request_date=now.date(),
        )


def touch_and_check_quota(user_id: str) -> Session:
    now = datetime.utcnow()
    with _lock:
        session = _sessions.get(user_id)
        if session is None:
            raise SessionNotFound()
        if _expired(session, now):
            del _sessions[user_id]
            raise SessionExpired()

        if session.request_date != now.date():
            session.request_date = now.date()
            session.request_count = 0

        if session.request_count >= DAILY_REQUEST_LIMIT:
            raise DailyLimitExceeded(session.request_count)

        session.request_count += 1
        session.last_active = now
        return session


def get_session_readonly(user_id: str) -> Session | None:
    now = datetime.utcnow()
    with _lock:
        session = _sessions.get(user_id)
        if session is None or _expired(session, now):
            return None
        return session


def delete_session(user_id: str) -> None:
    with _lock:
        _sessions.pop(user_id, None)