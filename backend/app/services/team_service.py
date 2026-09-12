import os
import uuid

from flask import current_app
from werkzeug.utils import secure_filename

from app.models.team_member import TeamMember
from app.repositories.team_repository import TeamRepository


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


class TeamService:

    @staticmethod
    def get_all_members():
        members = TeamRepository.get_all()

        return [
            member.to_dict()
            for member in members
        ]

    @staticmethod
    def create_member(data, image=None):
        name = data.get("name", "").strip()
        role = data.get("role", "").strip()

        description = (
            data.get("description", "").strip()
            or None
        )

        email = (
            data.get("email", "").strip()
            or None
        )

        instagram = (
            data.get("instagram", "").strip()
            or None
        )

        # -------------------------
        # VALIDARE
        # -------------------------

        if not name:
            raise ValueError(
                "Numele membrului este obligatoriu."
            )

        if not role:
            raise ValueError(
                "Funcția membrului este obligatorie."
            )

        try:
            display_order = int(
                data.get("display_order", 0)
            )
        except (TypeError, ValueError):
            raise ValueError(
                "Ordinea de afișare trebuie să fie un număr."
            )

        if display_order < 0:
            raise ValueError(
                "Ordinea de afișare nu poate fi negativă."
            )

        # -------------------------
        # SALVARE IMAGINE
        # -------------------------

        image_url = None

        if image and image.filename:

            if not is_allowed_image(image.filename):
                raise ValueError(
                    "Fotografia trebuie să fie JPG, "
                    "JPEG, PNG sau WEBP."
                )

            original_filename = secure_filename(
                image.filename
            )

            extension = (
                original_filename
                .rsplit(".", 1)[1]
                .lower()
            )

            filename = (
                f"{uuid.uuid4().hex}.{extension}"
            )

            team_folder = os.path.join(
                current_app.config["UPLOAD_FOLDER"],
                "team"
            )

            os.makedirs(
                team_folder,
                exist_ok=True
            )

            image_path = os.path.join(
                team_folder,
                filename
            )

            image.save(image_path)

            image_url = (
                f"/api/members/images/{filename}"
            )

        # -------------------------
        # CREARE MEMBRU
        # -------------------------

        member = TeamMember(
            name=name,
            role=role,
            description=description,
            image_url=image_url,
            email=email,
            instagram=instagram,
            display_order=display_order,
        )

        member = TeamRepository.create(member)

        return member.to_dict()

    @staticmethod
    def delete_member(member_id):
        member = TeamRepository.get_by_id(
            member_id
        )

        if not member:
            return False

        # -------------------------
        # ȘTERGERE IMAGINE
        # -------------------------

        if (
            member.image_url
            and member.image_url.startswith(
                "/api/members/images/"
            )
        ):
            filename = member.image_url.rsplit(
                "/",
                1
            )[1]

            image_path = os.path.join(
                current_app.config["UPLOAD_FOLDER"],
                "team",
                filename
            )

            if os.path.exists(image_path):
                try:
                    os.remove(image_path)
                except OSError:
                    pass

        TeamRepository.delete(member)

        return True