from flask import current_app
from werkzeug.security import check_password_hash


class AuthService:

    @staticmethod
    def authenticate(email, password):
        admin_email = current_app.config["ADMIN_EMAIL"]
        password_hash = current_app.config["ADMIN_PASSWORD_HASH"]

        print("Email identic:", email == admin_email)
        print("Hash exista:", bool(password_hash))
        print(
                "Password check:",
                check_password_hash(password_hash, password)
        )
        
        if not email or not password:
            return False

        if email != admin_email:
            return False

        return check_password_hash(
            password_hash,
            password
        )