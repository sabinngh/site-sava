import os
from flask import (
    Blueprint,
    jsonify,
    request,
    send_from_directory,
    current_app,
)

from app.services.news_service import NewsService
from app.utils.auth import admin_required


news_bp = Blueprint(
    "news",
    __name__,
    url_prefix="/api/news"
)


@news_bp.get("")
def get_news():
    news = NewsService.get_all_news()

    return jsonify(news), 200


@news_bp.post("")
@admin_required
def create_news():
    data = request.form
    image = request.files.get("image")

    try:
        news = NewsService.create_news(
            data,
            image
        )

        return jsonify(news), 201

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


@news_bp.delete("/<int:news_id>")
@admin_required
def delete_news(news_id):
    deleted = NewsService.delete_news(news_id)

    if not deleted:
        return jsonify({
            "error": "Știrea nu a fost găsită."
        }), 404

    return jsonify({
        "message": "Știrea a fost ștearsă cu succes."
    }), 200

@news_bp.get("/images/<filename>")
def get_news_image(filename):
    news_upload_folder = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        "news"
    )

    return send_from_directory(
        news_upload_folder,
        filename
    )

@news_bp.get("/<int:news_id>")
def get_news_by_id(news_id):
    news = NewsService.get_news_by_id(news_id)

    if not news:
        return jsonify({
            "error": "Știrea nu a fost găsită."
        }), 404

    return jsonify(news), 200