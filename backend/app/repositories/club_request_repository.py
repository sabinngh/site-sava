from app.extensions import db
from app.models.club_request import ClubRequest


class ClubRequestRepository:

    @staticmethod
    def create(club_request):
        db.session.add(club_request)
        db.session.commit()

        return club_request


    @staticmethod
    def get_by_id(request_id):
        return db.session.get(
            ClubRequest,
            request_id
        )


    @staticmethod
    def get_pending():
        return (
            ClubRequest.query
            .filter_by(status="pending")
            .order_by(ClubRequest.created_at.desc())
            .all()
        )

    @staticmethod
    def update_status(club_request, status):
        club_request.status = status
        db.session.commit()

        return club_request


    @staticmethod
    def save():
        db.session.commit()