import os

from flask import current_app

from app.models.gallery_image import GalleryImage
from app.repositories.gallery_repository import GalleryRepository
from app.utils.file_utils import (
    is_allowed_image,
    generate_image_filename,
    delete_file,
)


class GalleryService:

    @staticmethod
    def get_all_images():
        images = GalleryRepository.get_all()

        return [
            image.to_dict()
            for image in images
        ]


    @staticmethod
    def create_image(data, image):
        description = (
            data.get("description") or ""
        ).strip()

        if not description:
            raise ValueError(
                "Descrierea este obligatorie."
            )

        if len(description) > 60:
            raise ValueError(
                "Descrierea poate avea maximum 60 de caractere."
            )

        if not image or not image.filename:
            raise ValueError(
                "Trebuie să selectezi o imagine."
            )

        if not is_allowed_image(image.filename):
            raise ValueError(
                "Imaginea trebuie să fie JPG, JPEG, PNG sau WEBP."
            )

        image_filename = generate_image_filename(
            image.filename
        )

        gallery_folder = os.path.join(
            current_app.config["UPLOAD_FOLDER"],
            "gallery"
        )

        os.makedirs(
            gallery_folder,
            exist_ok=True
        )

        image_path = os.path.join(
            gallery_folder,
            image_filename
        )

        image.save(image_path)

        gallery_image = GalleryImage(
            description=description,
            image_filename=image_filename,
        )

        try:
            created_image = (
                GalleryRepository.create(
                    gallery_image
                )
            )

        except Exception:
            delete_file(image_path)
            raise

        return created_image.to_dict()


    @staticmethod
    def delete_image(image_id):
        image = GalleryRepository.get_by_id(
            image_id
        )

        if not image:
            return False

        image_filename = image.image_filename

        GalleryRepository.delete(image)

        image_path = os.path.join(
            current_app.config["UPLOAD_FOLDER"],
            "gallery",
            image_filename
        )

        delete_file(image_path)

        return True

    @staticmethod
    def create_images(data, images):
        description = (
            data.get("description") or ""
        ).strip()

        if not description:
            raise ValueError(
                "Descrierea este obligatorie."
            )

        if len(description) > 60:
            raise ValueError(
                "Descrierea poate avea maximum 60 de caractere."
            )

        if not images:
            raise ValueError(
                "Trebuie să selectezi cel puțin o imagine."
            )

        created_images = []

        for image in images:

            if not image or not image.filename:
                continue

            if not is_allowed_image(image.filename):
                raise ValueError(
                    f"Fișierul {image.filename} nu este o imagine acceptată."
                )

            image_filename = generate_image_filename(
                image.filename
            )

            gallery_folder = os.path.join(
                current_app.config["UPLOAD_FOLDER"],
                "gallery"
            )

            os.makedirs(
                gallery_folder,
                exist_ok=True
            )

            image_path = os.path.join(
                gallery_folder,
                image_filename
            )

            image.save(image_path)

            gallery_image = GalleryImage(
                description=description,
                image_filename=image_filename,
            )

            try:
                created_image = (
                    GalleryRepository.create(
                        gallery_image
                    )
                )

                created_images.append(
                    created_image.to_dict()
                )

            except Exception:
                delete_file(image_path)
                raise

        return created_images