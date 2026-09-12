import os

from flask import current_app

from app.repositories.club_repository import ClubRepository

class ClubService:

    @staticmethod
    def get_all_clubs():
        clubs = ClubRepository.get_all()

        return [
            club.to_dict()
            for club in clubs
        ]


    @staticmethod
    def get_club_by_id(club_id):
        club = ClubRepository.get_by_id(
            club_id
        )

        if not club:
            return None

        return club.to_dict()

    @staticmethod
    def delete_club(club_id):
        club = ClubRepository.get_by_id(club_id)

        if not club:
            raise ValueError(
                "Clubul nu a fost găsit."
            )

        # Reținem fișierele înainte să ștergem clubul
        filenames = []

        if club.cover_image_filename:
            filenames.append(
                club.cover_image_filename
            )

        for image in club.images:
            if image.image_filename:
                filenames.append(
                    image.image_filename
                )

        
        ClubRepository.delete(club)

        
        clubs_folder = os.path.join(
            current_app.config["UPLOAD_FOLDER"],
            "clubs"
        )

        for filename in filenames:
            file_path = os.path.join(
                clubs_folder,
                filename
            )

            if os.path.exists(file_path):
                os.remove(file_path)