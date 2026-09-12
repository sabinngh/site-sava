import os

from flask import (
    Blueprint,
    jsonify,
    request,
    send_from_directory,
    current_app,
)

from app.services.club_service import ClubService

from app.services.club_request_service import (
    ClubRequestService,
)

from app.services.club_edit_request_service import (
    ClubEditRequestService,
)

from app.utils.auth import admin_required


club_bp = Blueprint(
    "clubs",
    __name__,
    url_prefix="/api/clubs"
)


# =========================================================
# CLUBURI PUBLICE
# =========================================================


@club_bp.get("")
def get_clubs():
    clubs = ClubService.get_all_clubs()

    return jsonify(clubs), 200


@club_bp.get("/<int:club_id>")
def get_club(club_id):
    club = ClubService.get_club_by_id(
        club_id
    )

    if not club:
        return jsonify({
            "error": "Clubul nu a fost găsit."
        }), 404

    return jsonify(club), 200


# =========================================================
# IMAGINI CLUBURI
# =========================================================


@club_bp.get("/images/<filename>")
def get_club_image(filename):
    clubs_folder = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        "clubs"
    )

    return send_from_directory(
        clubs_folder,
        filename
    )


# =========================================================
# CERERE ÎNSCRIERE CLUB
# =========================================================


@club_bp.post("/requests")
def create_club_request():
    data = request.form

    cover_image = request.files.get(
        "cover_image"
    )

    try:
        club_request = (
            ClubRequestService.create_request(
                data,
                cover_image
            )
        )

        return jsonify({
            "message": (
                "Cererea a fost trimisă cu succes "
                "și așteaptă aprobarea administratorului."
            ),
            "request": club_request,
        }), 201

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


# =========================================================
# CERERI ÎNSCRIERE CLUB - ADMIN
# =========================================================


@club_bp.get("/requests")
@admin_required
def get_pending_club_requests():
    requests = (
        ClubRequestService
        .get_pending_requests()
    )

    return jsonify(requests), 200


@club_bp.get("/request-images/<filename>")
@admin_required
def get_request_image(filename):
    requests_folder = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        "club_requests"
    )

    return send_from_directory(
        requests_folder,
        filename
    )


@club_bp.post(
    "/requests/<int:request_id>/approve"
)
@admin_required
def approve_club_request(request_id):
    try:
        club = (
            ClubRequestService
            .approve_request(request_id)
        )

        return jsonify({
            "message": (
                "Clubul a fost aprobat."
            ),
            "club": club,
        }), 200

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


@club_bp.post(
    "/requests/<int:request_id>/reject"
)
@admin_required
def reject_club_request(request_id):
    try:
        club_request = (
            ClubRequestService
            .reject_request(request_id)
        )

        return jsonify({
            "message": (
                "Cererea a fost respinsă."
            ),
            "request": club_request,
        }), 200

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


# =========================================================
# PROPUNERE MODIFICĂRI CLUB - PUBLIC
# =========================================================


@club_bp.post(
    "/<int:club_id>/edit-requests"
)
def create_club_edit_request(club_id):
    data = request.form

    cover_image = request.files.get(
        "cover_image"
    )

    try:
        edit_request = (
            ClubEditRequestService
            .create_request(
                club_id,
                data,
                cover_image
            )
        )

        return jsonify({
            "message": (
                "Propunerea a fost trimisă cu succes "
                "și așteaptă aprobarea administratorului."
            ),
            "request": edit_request,
        }), 201

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


# =========================================================
# PROPUNERI MODIFICĂRI CLUB - ADMIN
# =========================================================


@club_bp.get("/edit-requests")
@admin_required
def get_pending_edit_requests():
    requests = (
        ClubEditRequestService
        .get_pending_requests()
    )

    return jsonify(requests), 200


@club_bp.get(
    "/edit-request-images/<filename>"
)
@admin_required
def get_edit_request_image(filename):
    images_folder = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        "club_edit_requests"
    )

    return send_from_directory(
        images_folder,
        filename
    )


@club_bp.post(
    "/edit-requests/<int:request_id>/approve"
)
@admin_required
def approve_edit_request(request_id):
    try:
        club = (
            ClubEditRequestService
            .approve_request(
                request_id
            )
        )

        return jsonify({
            "message": (
                "Modificările au fost aprobate."
            ),
            "club": club,
        }), 200

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


@club_bp.post(
    "/edit-requests/<int:request_id>/reject"
)
@admin_required
def reject_edit_request(request_id):
    try:
        edit_request = (
            ClubEditRequestService
            .reject_request(
                request_id
            )
        )

        return jsonify({
            "message": (
                "Propunerea a fost respinsă."
            ),
            "request": edit_request,
        }), 200

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


# =========================================================
# ȘTERGERE CLUB - ADMIN
# =========================================================


@club_bp.delete("/<int:club_id>")
@admin_required
def delete_club(club_id):
    try:
        ClubService.delete_club(
            club_id
        )

        return jsonify({
            "message": (
                "Clubul a fost șters cu succes."
            )
        }), 200

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 404