from datetime import datetime, timezone

from app.extensions import db


class News(db.Model):
    __tablename__ = "news"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    content = db.Column(
        db.Text,
        nullable=False
    )

    image_filename = db.Column(
        db.String(255),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        image_url = None

        if self.image_filename:
            image_url = (
            f"/api/news/images/{self.image_filename}"
            )

        
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "image_url": image_url,
            "created_at": self.created_at.isoformat(),
        }