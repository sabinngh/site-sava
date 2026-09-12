from datetime import datetime, timezone

from app.extensions import db


class Club(db.Model):
    __tablename__ = "clubs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(120),
        nullable=False
    )

    short_description = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    president_name = db.Column(
        db.String(120),
        nullable=False
    )

    contact_email = db.Column(
        db.String(255),
        nullable=False
    )

    instagram = db.Column(
        db.String(120),
        nullable=True
    )

    cover_image_filename = db.Column(
        db.String(255),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    images = db.relationship(
        "ClubImage",
        back_populates="club",
        cascade="all, delete-orphan"
    )

    edit_requests = db.relationship(
        "ClubEditRequest",
        back_populates="club",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "short_description": self.short_description,
            "description": self.description,
            "president_name": self.president_name,
            "contact_email": self.contact_email,
            "instagram": self.instagram,

            "cover_image_url": (
                f"/api/clubs/images/{self.cover_image_filename}"
                if self.cover_image_filename
                else None
            ),

            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),

            "images": [
                image.to_dict()
                for image in self.images
            ],
        }