from app.models.team_member import TeamMember
from app.extensions import db


class TeamRepository:

    @staticmethod
    def get_all():
        return (
            TeamMember.query
            .order_by(TeamMember.display_order.asc())
            .all()
        )

    @staticmethod
    def get_by_id(member_id):
        return db.session.get(TeamMember, member_id)

    @staticmethod
    def create(member):
        db.session.add(member)
        db.session.commit()

        return member

    @staticmethod
    def delete(member):
        db.session.delete(member)
        db.session.commit()