from app.extensions import db


class TeamMember(db.Model):
    __tablename__ = "team_members"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    image_url = db.Column(
        db.String(500),
        nullable=True
    )

    email = db.Column(
        db.String(150),
        nullable=True
    )

    instagram = db.Column(
        db.String(255),
        nullable=True
    )

    display_order = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "description": self.description,
            "image_url": self.image_url,
            "email": self.email,
            "instagram": self.instagram,
            "display_order": self.display_order,
        }