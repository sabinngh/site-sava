import os

from flask import (
    Blueprint,
    jsonify,
    request,
    send_from_directory,
    current_app,
)

from app.services.gallery_service import GalleryService
from app.utils.auth import admin_required


gallery_bp = Blueprint(
    "gallery",
    __name__,
    url_prefix="/api/gallery"
)


# PUBLIC
@gallery_bp.get("")
def get_gallery():
    images = GalleryService.get_all_images()

    return jsonify(images), 200


# ADMIN
@gallery_bp.post("")
@admin_required
def upload_image():
    data = request.form
    images = request.files.getlist("images")

    try:
        created_images = GalleryService.create_images(
            data,
            images
        )

        return jsonify({
            "message": (
                f"{len(created_images)} fotografii "
                "au fost adăugate."
            ),
            "images": created_images,
        }), 201

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


# ADMIN
@gallery_bp.delete("/<int:image_id>")
@admin_required
def delete_image(image_id):
    deleted = GalleryService.delete_image(
        image_id
    )

    if not deleted:
        return jsonify({
            "error": "Imaginea nu a fost găsită."
        }), 404

    return jsonify({
        "message": "Imaginea a fost ștearsă."
    }), 200


# PUBLIC
@gallery_bp.get("/images/<filename>")
def get_image(filename):
    gallery_folder = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        "gallery"
    )

    return send_from_directory(
        gallery_folder,
        filename
    )