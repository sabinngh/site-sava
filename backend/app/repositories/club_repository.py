from app.extensions import db
from app.models.club import Club


class ClubRepository:

    @staticmethod
    def get_all():
        return (
            Club.query
            .order_by(Club.name.asc())
            .all()
        )

    @staticmethod
    def get_by_id(club_id):
        return db.session.get(
            Club,
            club_id
        )

    @staticmethod
    def create(club):
        db.session.add(club)
        db.session.commit()

        return club

    @staticmethod
    def delete(club):
        db.session.delete(club)
        db.session.commit()