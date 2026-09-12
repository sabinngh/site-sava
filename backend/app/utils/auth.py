from functools import wraps

from flask import jsonify, session


def admin_required(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):

        if not session.get("admin_authenticated"):
            return jsonify({
                "error": "Autentificare necesară."
            }), 401

        return function(*args, **kwargs)

    return decorated_function