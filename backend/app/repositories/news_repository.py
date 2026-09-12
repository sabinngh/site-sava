from app.extensions import db
from app.models.news import News


class NewsRepository:

    @staticmethod
    def get_all():
        return (
            News.query
            .order_by(News.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(news_id):
        return db.session.get(News, news_id)

    @staticmethod
    def create(news):
        db.session.add(news)
        db.session.commit()

        return news

    @staticmethod
    def delete(news):
        db.session.delete(news)
        db.session.commit()