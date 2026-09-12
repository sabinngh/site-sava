from datetime import datetime, timezone

from app.extensions import db


class ClubImage(db.Model):
    __tablename__ = "club_images"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    club_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "clubs.id",
            ondelete="CASCADE"
        ),
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

    club = db.relationship(
        "Club",
        back_populates="images"
    )

    def to_dict(self):
        return {
            "id": self.id,

            "image_url": (
                f"/api/clubs/images/{self.image_filename}"
            ),

            "created_at": self.created_at.isoformat(),
        }