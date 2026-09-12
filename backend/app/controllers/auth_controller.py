from flask import Blueprint, jsonify, request, session

from app.services.auth_service import AuthService


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    authenticated = AuthService.authenticate(
        email,
        password
    )

    if not authenticated:
        return jsonify({
            "error": "Email sau parolă incorectă."
        }), 401

    session.clear()

    session.permanent = False
    
    session["admin_authenticated"] = True

    return jsonify({
        "message": "Autentificare reușită."
    }), 200


@auth_bp.post("/logout")
def logout():
    session.clear()

    return jsonify({
        "message": "Te-ai delogat."
    }), 200


@auth_bp.get("/status")
def auth_status():
    authenticated = session.get(
        "admin_authenticated",
        False
    )

    return jsonify({
        "authenticated": authenticated
    }), 200