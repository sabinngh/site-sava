import os

from flask import current_app

from app.models.club_request import ClubRequest
from app.repositories.club_request_repository import (
    ClubRequestRepository,
)

from app.utils.file_utils import (
    is_allowed_image,
    generate_image_filename,
    delete_file,
)

import shutil

from app.models.club import Club
from app.repositories.club_repository import ClubRepository

class ClubRequestService:

    @staticmethod
    def create_request(data, cover_image):
        name = (
            data.get("name") or ""
        ).strip()

        short_description = (
            data.get("short_description") or ""
        ).strip()

        description = (
            data.get("description") or ""
        ).strip()

        president_name = (
            data.get("president_name") or ""
        ).strip()

        contact_email = (
            data.get("contact_email") or ""
        ).strip()

        instagram = (
            data.get("instagram") or ""
        ).strip()

        requester_name = (
            data.get("requester_name") or ""
        ).strip()

        requester_email = (
            data.get("requester_email") or ""
        ).strip()


        # VALIDARE

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
                "Numele persoanei care trimite cererea este obligatoriu."
            )

        if not requester_email:
            raise ValueError(
                "Emailul persoanei care trimite cererea este obligatoriu."
            )

        if len(name) > 120:
            raise ValueError(
                "Numele clubului este prea lung."
            )

        if len(short_description) > 200:
            raise ValueError(
                "Descrierea scurtă poate avea maximum 200 de caractere."
            )


        cover_image_filename = None
        image_path = None


        # COVER IMAGE

        if cover_image and cover_image.filename:

            if not is_allowed_image(
                cover_image.filename
            ):
                raise ValueError(
                    "Imaginea trebuie să fie JPG, JPEG, PNG sau WEBP."
                )

            cover_image_filename = (
                generate_image_filename(
                    cover_image.filename
                )
            )

            requests_folder = os.path.join(
                current_app.config["UPLOAD_FOLDER"],
                "club_requests"
            )

            os.makedirs(
                requests_folder,
                exist_ok=True
            )

            image_path = os.path.join(
                requests_folder,
                cover_image_filename
            )

            cover_image.save(image_path)


        club_request = ClubRequest(
            name=name,
            short_description=short_description,
            description=description,
            president_name=president_name,
            contact_email=contact_email,

            instagram=(
                instagram
                if instagram
                else None
            ),

            cover_image_filename=cover_image_filename,

            requester_name=requester_name,
            requester_email=requester_email,

            status="pending",
        )


        try:
            created_request = (
                ClubRequestRepository.create(
                    club_request
                )
            )

        except Exception:
            if image_path:
                delete_file(image_path)

            raise


        return created_request.to_dict()


    @staticmethod
    def get_pending_requests():
        requests = (
            ClubRequestRepository.get_pending()
        )

        return [
            club_request.to_dict()
            for club_request in requests
        ]

    @staticmethod
    def approve_request(request_id):
        club_request = (
            ClubRequestRepository.get_by_id(
                request_id
            )
        )

        if not club_request:
            raise ValueError(
                "Cererea nu a fost găsită."
            )

        if club_request.status != "pending":
            raise ValueError(
                "Această cerere a fost deja procesată."
            )


        club = Club(
            name=club_request.name,
            short_description=club_request.short_description,
            description=club_request.description,
            president_name=club_request.president_name,
            contact_email=club_request.contact_email,
            instagram=club_request.instagram,
            cover_image_filename=club_request.cover_image_filename,
        )


        

        if club_request.cover_image_filename:

            requests_folder = os.path.join(
                current_app.config["UPLOAD_FOLDER"],
                "club_requests"
            )

            clubs_folder = os.path.join(
                current_app.config["UPLOAD_FOLDER"],
                "clubs"
            )

            os.makedirs(
                clubs_folder,
                exist_ok=True
            )

            old_path = os.path.join(
                requests_folder,
                club_request.cover_image_filename
            )

            new_path = os.path.join(
                clubs_folder,
                club_request.cover_image_filename
            )

            if os.path.exists(old_path):
                shutil.move(
                    old_path,
                    new_path
                )


        try:
            created_club = (
                ClubRepository.create(club)
            )

            ClubRequestRepository.update_status(
                club_request,
                "approved"
            )

        except Exception:
            raise


        return created_club.to_dict()


    @staticmethod
    def reject_request(request_id):
        club_request = (
            ClubRequestRepository.get_by_id(
                request_id
            )
        )

        if not club_request:
            raise ValueError(
                "Cererea nu a fost găsită."
            )

        if club_request.status != "pending":
            raise ValueError(
                "Această cerere a fost deja procesată."
            )

        ClubRequestRepository.update_status(
            club_request,
            "rejected"
        )

        return club_request.to_dict()