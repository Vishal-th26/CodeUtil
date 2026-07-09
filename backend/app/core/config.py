from dotenv  import load_dotenv
import os

load_dotenv()
class Settings:
    def __init__(self):
        self.SECRET_KEY=os.getenv("SECRET_KEY")
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY is not set in the environment variables.")
        self.DATABASE_URL=os.getenv("DATABASE_URL")
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL is not set in the environment variables.")
        self.ALGORITHM=os.getenv("ALGORITHM")
        if not self.ALGORITHM:
            raise ValueError("ALGORITHM is not set in the environment variables.")
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
        if not self.ACCESS_TOKEN_EXPIRE_MINUTES:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES is not set in the environment variables.")
        
settings = Settings()        
