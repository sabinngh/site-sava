from datetime import datetime, timezone

from app.extensions import db


class ClubRequest(db.Model):
    __tablename__ = "club_requests"

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

    # Date despre persoana care trimite cererea

    requester_name = db.Column(
        db.String(120),
        nullable=False
    )

    requester_email = db.Column(
        db.String(255),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="pending"
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
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
                f"/api/clubs/request-images/{self.cover_image_filename}"
                if self.cover_image_filename
                else None
            ),

            "requester_name": self.requester_name,
            "requester_email": self.requester_email,

            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }