import "./Sidebar.css";

const ACCOUNT_ITEMS = [
  { view: "signup", ext: ".new", label: "sign up" },
  { view: "login", ext: ".auth", label: "log in" },
];

const CODEBASE_ITEMS = [
  { view: "upload", ext: ".idx", label: "upload" },
  { view: "ask", ext: ".qry", label: "ask" },
  { view: "viva", ext: ".viva", label: "viva" },
  { view: "status", ext: ".sys", label: "status" },
];

export default function Sidebar({ view, setView, isAuthed }) {
  return (
    <nav className="sidebar" aria-label="Sections">
      <div className="nav-group">
        <div className="group-label">account</div>
        {ACCOUNT_ITEMS.map((item) => (
          <NavItem key={item.view} item={item} active={view === item.view} onClick={() => setView(item.view)} />
        ))}
      </div>
      <div className="nav-group">
        <div className="group-label">codebase</div>
        {CODEBASE_ITEMS.map((item) => (
          <NavItem
            key={item.view}
            item={item}
            active={view === item.view}
            locked={!isAuthed}
            onClick={() => isAuthed && setView(item.view)}
          />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ item, active, locked, onClick }) {
  return (
    <button
      type="button"
      className={"navitem" + (active ? " active" : "") + (locked ? " locked" : "")}
      onClick={onClick}
      disabled={locked}
      aria-current={active ? "page" : undefined}
      title={locked ? "Log in to unlock" : undefined}
    >
      <span className="ext mono">{item.ext}</span>
      <span>{item.label}</span>
    </button>
  );
}
