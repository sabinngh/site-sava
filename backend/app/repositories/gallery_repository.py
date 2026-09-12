from app.extensions import db
from app.models.gallery_image import GalleryImage


class GalleryRepository:

    @staticmethod
    def get_all():
        return (
            GalleryImage.query
            .order_by(GalleryImage.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(image_id):
        return db.session.get(
            GalleryImage,
            image_id
        )

    @staticmethod
    def create(image):
        db.session.add(image)
        db.session.commit()

        return image

    @staticmethod
    def delete(image):
        db.session.delete(image)
        db.session.commit()