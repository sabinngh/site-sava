import os

from flask import current_app

from app.models.news import News
from app.repositories.news_repository import NewsRepository
from app.utils.file_utils import (
    is_allowed_image,
    generate_image_filename,
    delete_file,
)


class NewsService:

    @staticmethod
    def get_all_news():
        news = NewsRepository.get_all()

        return [
            item.to_dict()
            for item in news
        ]

    @staticmethod
    def create_news(data, image):
        title = (data.get("title") or "").strip()
        content = (data.get("content") or "").strip()

        if not title:
            raise ValueError(
                "Titlul este obligatoriu."
            )

        if not content:
            raise ValueError(
                "Conținutul este obligatoriu."
            )

        image_filename = None

        if image and image.filename:

            if not is_allowed_image(image.filename):
                raise ValueError(
                    "Imaginea trebuie să fie JPG, JPEG, PNG sau WEBP."
                )

            image_filename = generate_image_filename(
                image.filename
            )

            news_upload_folder = os.path.join(
                current_app.config["UPLOAD_FOLDER"],
                "news"
            )

            os.makedirs(
                news_upload_folder,
                exist_ok=True
            )

            image_path = os.path.join(
                news_upload_folder,
                image_filename
            )

            image.save(image_path)

        news = News(
            title=title,
            content=content,
            image_filename=image_filename,
        )

        try:
            created_news = NewsRepository.create(news)

        except Exception:
            # Dacă DB-ul eșuează după ce am salvat imaginea,
            # nu vrem să rămână fișierul abandonat.
            if image_filename:
                image_path = os.path.join(
                    current_app.config["UPLOAD_FOLDER"],
                    "news",
                    image_filename
                )

                delete_file(image_path)

            raise

        return created_news.to_dict()

    @staticmethod
    def delete_news(news_id):
        news = NewsRepository.get_by_id(news_id)

        if not news:
            return False

        image_filename = news.image_filename

        NewsRepository.delete(news)

        if image_filename:
            image_path = os.path.join(
                current_app.config["UPLOAD_FOLDER"],
                "news",
                image_filename
            )

            delete_file(image_path)

        return True

    @staticmethod
    def get_news_by_id(news_id):
        news = NewsRepository.get_by_id(news_id)

        if not news:
            return None

        return news.to_dict()