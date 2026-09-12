from flask import Flask
from flask_cors import CORS

from config import Config
from app.extensions import db, migrate


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(
        app,
        supports_credentials=True,
        origins=[app.config["FRONTEND_URL"]]
    )

    db.init_app(app)

    from app import models

    migrate.init_app(app, db)

    from app.controllers.team_controller import team_bp
    from app.controllers.auth_controller import auth_bp
    from app.controllers.news_controller import news_bp
    from app.controllers.gallery_controller import gallery_bp
    from app.controllers.club_controller import club_bp

    app.register_blueprint(team_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(news_bp)
    app.register_blueprint(gallery_bp)
    app.register_blueprint(club_bp)

    return app