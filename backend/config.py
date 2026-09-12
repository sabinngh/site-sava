import os

from dotenv import load_dotenv


BASE_DIR = os.path.abspath(
    os.path.dirname(__file__)
)

load_dotenv(
    os.path.join(BASE_DIR, ".env")
)


class Config:
    # -------------------------
    # GENERAL
    # -------------------------

    SECRET_KEY = os.getenv("SECRET_KEY")

    # -------------------------
    # DATABASE
    # -------------------------

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # -------------------------
    # ADMIN
    # -------------------------

    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

    ADMIN_PASSWORD_HASH = os.getenv(
        "ADMIN_PASSWORD_HASH"
    )

    # -------------------------
    # SESSION / COOKIES
    # -------------------------

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"

    # Dev = False
    # Production = True
    SESSION_COOKIE_SECURE = (
        os.getenv(
            "SESSION_COOKIE_SECURE",
            "false"
        ).lower() == "true"
    )

    # -------------------------
    # UPLOADS
    # -------------------------

    UPLOAD_FOLDER = os.path.join(
        BASE_DIR,
        "uploads"
    )

    MAX_CONTENT_LENGTH = (
        5 * 1024 * 1024
    )

    # -------------------------
    # FRONTEND
    # -------------------------

    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )