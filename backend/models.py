"""SQLAlchemy models for the Student Management Dashboard."""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import bcrypt

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=False, default="Admin")
    role = db.Column(db.String(20), nullable=False, default="admin")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, plain: str) -> None:
        self.password_hash = bcrypt.hashpw(
            plain.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def check_password(self, plain: str) -> bool:
        try:
            return bcrypt.checkpw(
                plain.encode("utf-8"), self.password_hash.encode("utf-8")
            )
        except ValueError:
            return False

    def to_dict(self) -> dict:
        return {"id": self.id, "email": self.email, "name": self.name, "role": self.role}


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    age = db.Column(db.Integer, nullable=False)
    department = db.Column(db.String(80), nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False, default="active", index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "age": self.age,
            "department": self.department,
            "status": self.status,
        }
