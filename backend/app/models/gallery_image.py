from datetime import datetime, timezone

from app.extensions import db


class GalleryImage(db.Model):
    __tablename__ = "gallery_images"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    description = db.Column(
        db.String(120),
        nullable=False
    )

    image_filename = db.Column(
        db.String(255),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "image_url": (
                f"/api/gallery/images/{self.image_filename}"
            ),
            "created_at": self.created_at.isoformat(),
        }