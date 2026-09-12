import os
import uuid

from flask import current_app
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models.club import Club
from app.models.club_edit_request import ClubEditRequest


ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
    "webp",
}


def is_allowed_image(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


class ClubEditRequestService:

    # =====================================================
    # CREARE PROPUNERE DE MODIFICARE
    # =====================================================

    @staticmethod
    def create_request(
        club_id,
        data,
        cover_image=None
    ):
        club = db.session.get(
            Club,
            club_id
        )

        if not club:
            raise ValueError(
                "Clubul nu a fost găsit."
            )

        # -------------------------------------------------
        # DATE CLUB
        # -------------------------------------------------

        name = data.get(
            "name",
            ""
        ).strip()

        short_description = data.get(
            "short_description",
            ""
        ).strip()

        description = data.get(
            "description",
            ""
        ).strip()

        president_name = data.get(
            "president_name",
            ""
        ).strip()

        contact_email = data.get(
            "contact_email",
            ""
        ).strip()

        instagram = data.get(
            "instagram",
            ""
        ).strip()

        # -------------------------------------------------
        # DATE SOLICITANT
        # -------------------------------------------------

        requester_name = data.get(
            "requester_name",
            ""
        ).strip()

        requester_email = data.get(
            "requester_email",
            ""
        ).strip()

        reason = data.get(
            "reason",
            ""
        ).strip()

        # -------------------------------------------------
        # VALIDARE
        # -------------------------------------------------

        if not name:
            raise ValueError(
                "Numele clubului este obligatoriu."
            )

        if not short_description:
            raise ValueError(
                "Descrierea scurtă este obligatorie."
            )

        if not description:
            raise ValueError(
                "Descrierea clubului este obligatorie."
            )

        if not president_name:
            raise ValueError(
                "Numele președintelui este obligatoriu."
            )

        if not contact_email:
            raise ValueError(
                "Emailul clubului este obligatoriu."
            )

        if not requester_name:
            raise ValueError(
                "Numele solicitantului este obligatoriu."
            )

        if not requester_email:
            raise ValueError(
                "Emailul solicitantului este obligatoriu."
            )

        # -------------------------------------------------
        # SALVARE IMAGINE PROPUSĂ
        # -------------------------------------------------

        cover_image_filename = None

        if cover_image and cover_image.filename:

            if not is_allowed_image(
                cover_image.filename
            ):
                raise ValueError(
                    "Imaginea trebuie să fie JPG, "
                    "JPEG, PNG sau WEBP."
                )

            original_filename = secure_filename(
                cover_image.filename
            )

            extension = (
                original_filename
                .rsplit(".", 1)[1]
                .lower()
            )

            cover_image_filename = (
                f"{uuid.uuid4().hex}.{extension}"
            )

            edit_images_folder = os.path.join(
                current_app.config[
                    "UPLOAD_FOLDER"
                ],
                "club_edit_requests"
            )

            os.makedirs(
                edit_images_folder,
                exist_ok=True
            )

            image_path = os.path.join(
                edit_images_folder,
                cover_image_filename
            )

            cover_image.save(
                image_path
            )

        # -------------------------------------------------
        # CREARE REQUEST
        # -------------------------------------------------

        edit_request = ClubEditRequest(
            club_id=club.id,

            name=name,
            short_description=short_description,
            description=description,

            president_name=president_name,
            contact_email=contact_email,

            instagram=instagram or None,

            cover_image_filename=(
                cover_image_filename
            ),

            requester_name=requester_name,
            requester_email=requester_email,

            reason=reason or None,

            status="pending"
        )

        try:
            db.session.add(
                edit_request
            )

            db.session.commit()

        except Exception:
            db.session.rollback()

            # Dacă DB-ul a eșuat după ce am
            # salvat imaginea, o ștergem.
            if cover_image_filename:
                image_path = os.path.join(
                    current_app.config[
                        "UPLOAD_FOLDER"
                    ],
                    "club_edit_requests",
                    cover_image_filename
                )

                if os.path.exists(
                    image_path
                ):
                    os.remove(
                        image_path
                    )

            raise

        return edit_request.to_dict()

    # =====================================================
    # CERERI PENDING
    # =====================================================

    @staticmethod
    def get_pending_requests():
        requests = (
            ClubEditRequest.query
            .filter_by(
                status="pending"
            )
            .order_by(
                ClubEditRequest.created_at.desc()
            )
            .all()
        )

        return [
            edit_request.to_dict()
            for edit_request in requests
        ]

    # =====================================================
    # APROBARE PROPUNERE
    # =====================================================

    @staticmethod
    def approve_request(
        request_id
    ):
        edit_request = db.session.get(
            ClubEditRequest,
            request_id
        )

        if not edit_request:
            raise ValueError(
                "Propunerea nu a fost găsită."
            )

        if edit_request.status != "pending":
            raise ValueError(
                "Această propunere a fost deja procesată."
            )

        club = db.session.get(
            Club,
            edit_request.club_id
        )

        if not club:
            raise ValueError(
                "Clubul asociat propunerii nu mai există."
            )

        # -------------------------------------------------
        # ACTUALIZARE INFORMAȚII CLUB
        # -------------------------------------------------

        club.name = (
            edit_request.name
        )

        club.short_description = (
            edit_request.short_description
        )

        club.description = (
            edit_request.description
        )

        club.president_name = (
            edit_request.president_name
        )

        club.contact_email = (
            edit_request.contact_email
        )

        club.instagram = (
            edit_request.instagram
        )

        # -------------------------------------------------
        # ACTUALIZARE IMAGINE
        # -------------------------------------------------

        if edit_request.cover_image_filename:

            edit_images_folder = os.path.join(
                current_app.config[
                    "UPLOAD_FOLDER"
                ],
                "club_edit_requests"
            )

            clubs_folder = os.path.join(
                current_app.config[
                    "UPLOAD_FOLDER"
                ],
                "clubs"
            )

            os.makedirs(
                clubs_folder,
                exist_ok=True
            )

            source_path = os.path.join(
                edit_images_folder,
                edit_request.cover_image_filename
            )

            destination_path = os.path.join(
                clubs_folder,
                edit_request.cover_image_filename
            )

            if not os.path.exists(
                source_path
            ):
                raise ValueError(
                    "Imaginea propusă nu mai există."
                )

            # Reținem imaginea veche pentru
            # a o putea șterge după mutarea
            # imaginii noi.
            old_image_filename = (
                club.cover_image_filename
            )

            os.replace(
                source_path,
                destination_path
            )

            club.cover_image_filename = (
                edit_request.cover_image_filename
            )

            # Ștergem imaginea veche
            if old_image_filename:

                old_image_path = os.path.join(
                    clubs_folder,
                    old_image_filename
                )

                if (
                    os.path.exists(
                        old_image_path
                    )
                    and old_image_path
                    != destination_path
                ):
                    os.remove(
                        old_image_path
                    )

        # -------------------------------------------------
        # REQUEST APROBAT
        # -------------------------------------------------

        edit_request.status = (
            "approved"
        )

        try:
            db.session.commit()

        except Exception:
            db.session.rollback()
            raise

        return club.to_dict()

    # =====================================================
    # RESPINGERE PROPUNERE
    # =====================================================

    @staticmethod
    def reject_request(
        request_id
    ):
        edit_request = db.session.get(
            ClubEditRequest,
            request_id
        )

        if not edit_request:
            raise ValueError(
                "Propunerea nu a fost găsită."
            )

        if edit_request.status != "pending":
            raise ValueError(
                "Această propunere a fost deja procesată."
            )

        # -------------------------------------------------
        # ȘTERGEM IMAGINEA PROPUSĂ
        # -------------------------------------------------

        if edit_request.cover_image_filename:

            image_path = os.path.join(
                current_app.config[
                    "UPLOAD_FOLDER"
                ],
                "club_edit_requests",
                edit_request.cover_image_filename
            )

            if os.path.exists(
                image_path
            ):
                os.remove(
                    image_path
                )

        # -------------------------------------------------
        # REQUEST RESPINS
        # -------------------------------------------------

        edit_request.status = (
            "rejected"
        )

        try:
            db.session.commit()

        except Exception:
            db.session.rollback()
            raise

        return edit_request.to_dict()