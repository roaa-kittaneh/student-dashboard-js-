"""JWT issuance and `require_auth` decorator."""
from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Optional

import jwt
from flask import current_app, g, jsonify, request

from models import User


def issue_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "iat": datetime.now(tz=timezone.utc),
        "exp": datetime.now(tz=timezone.utc)
        + timedelta(hours=current_app.config["JWT_EXPIRES_HOURS"]),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET"], algorithm="HS256")


def _decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(
            token, current_app.config["JWT_SECRET"], algorithms=["HS256"]
        )
    except jwt.PyJWTError:
        return None


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "missing_token"}), 401
        payload = _decode_token(header.split(" ", 1)[1])
        if not payload:
            return jsonify({"error": "invalid_or_expired_token"}), 401
        g.user_id = int(payload["sub"])
        g.user_email = payload["email"]
        return fn(*args, **kwargs)

    return wrapper
