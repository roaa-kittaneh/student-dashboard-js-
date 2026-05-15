"""Application factory for the Student Management API."""
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models import Student, User, db
from routes_auth import bp as auth_bp
from routes_students import bp as students_bp


def create_app(config_class: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=False,
    )

    db.init_app(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(students_bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "not_found"}), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"error": "internal_error"}), 500

    with app.app_context():
        db.create_all()
        _seed(app)

    return app


def _seed(app: Flask) -> None:
    """Idempotent seed: admin user + a few demo students."""
    if not User.query.filter_by(email=app.config["ADMIN_EMAIL"]).first():
        admin = User(email=app.config["ADMIN_EMAIL"], name="Admin", role="admin")
        admin.set_password(app.config["ADMIN_PASSWORD"])
        db.session.add(admin)

    if Student.query.count() == 0:
        demo = [
            Student(first_name="Ahmad", last_name="Saleh", email="ahmad@example.com",
                    age=21, department="Engineering", status="active"),
            Student(first_name="Layla", last_name="Hassan", email="layla@example.com",
                    age=22, department="Computer Science", status="active"),
            Student(first_name="Omar", last_name="Khalid", email="omar@example.com",
                    age=23, department="Engineering", status="graduated"),
            Student(first_name="Nour", last_name="Mansour", email="nour@example.com",
                    age=20, department="Mathematics", status="active"),
            Student(first_name="Yara", last_name="Najjar", email="yara@example.com",
                    age=24, department="Physics", status="inactive"),
        ]
        db.session.add_all(demo)

    db.session.commit()


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
