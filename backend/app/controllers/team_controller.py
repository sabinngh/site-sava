import os

from flask import (
    Blueprint,
    jsonify,
    request,
    send_from_directory,
    current_app,
)

from app.services.team_service import TeamService
from app.utils.auth import admin_required


team_bp = Blueprint(
    "team",
    __name__,
    url_prefix="/api/members"
)


@team_bp.get("")
def get_members():
    members = TeamService.get_all_members()

    return jsonify(members), 200


@team_bp.post("")
@admin_required
def create_member():
    data = request.form

    image = request.files.get("image")

    try:
        member = TeamService.create_member(
            data,
            image
        )

        return jsonify(member), 201

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


@team_bp.get("/images/<filename>")
def get_member_image(filename):
    team_folder = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        "team"
    )

    return send_from_directory(
        team_folder,
        filename
    )


@team_bp.delete("/<int:member_id>")
@admin_required
def delete_member(member_id):
    deleted = TeamService.delete_member(
        member_id
    )

    if not deleted:
        return jsonify({
            "error": "Membrul nu a fost găsit."
        }), 404

    return jsonify({
        "message": (
            "Membrul a fost șters cu succes."
        )
    }), 200