"""Authentication routes — login + self-service registration."""
import re

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from auth import issue_token
from models import User, db

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_RX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
MIN_PW_LEN = 6
MAX_PW_LEN = 128


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "email_and_password_required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "invalid_credentials"}), 401

    return jsonify({"token": issue_token(user), "user": user.to_dict()})


@bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    name = (data.get("name") or "").strip() or email.split("@", 1)[0]

    errors = []
    if not EMAIL_RX.match(email):
        errors.append("invalid_email")
    if not (MIN_PW_LEN <= len(password) <= MAX_PW_LEN):
        errors.append(f"password_must_be_{MIN_PW_LEN}_to_{MAX_PW_LEN}_chars")
    if len(name) > 120:
        errors.append("name_too_long")
    if errors:
        return jsonify({"error": "validation_failed", "details": errors}), 400

    user = User(email=email, name=name, role="user")
    user.set_password(password)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "email_already_registered"}), 409

    # Auto-login: same shape as /login so the frontend can store and route through.
    return jsonify({"token": issue_token(user), "user": user.to_dict()}), 201
