"""Student CRUD routes with search, filters, and pagination."""
from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError

from auth import require_auth
from models import Student, db

bp = Blueprint("students", __name__, url_prefix="/api/students")

ALLOWED_STATUS = {"active", "inactive", "graduated"}
REQUIRED_FIELDS = ("firstName", "lastName", "email", "age", "department", "status")


def _validate_payload(data: dict, partial: bool = False) -> tuple[dict, list[str]]:
    errors: list[str] = []
    cleaned: dict = {}

    def _str(key, max_len=120, lower=False):
        v = data.get(key)
        if v is None:
            if not partial:
                errors.append(f"{key} is required")
            return None
        if not isinstance(v, str) or not v.strip():
            errors.append(f"{key} must be a non-empty string")
            return None
        v = v.strip()
        if lower:
            v = v.lower()
        if len(v) > max_len:
            errors.append(f"{key} exceeds {max_len} chars")
        return v

    if "firstName" in data or not partial:
        v = _str("firstName", 80)
        if v is not None:
            cleaned["first_name"] = v
    if "lastName" in data or not partial:
        v = _str("lastName", 80)
        if v is not None:
            cleaned["last_name"] = v
    if "email" in data or not partial:
        v = _str("email", 120, lower=True)
        if v and "@" not in v:
            errors.append("email is invalid")
        elif v:
            cleaned["email"] = v
    if "age" in data or not partial:
        age = data.get("age")
        if not isinstance(age, int) or age < 10 or age > 120:
            errors.append("age must be an integer between 10 and 120")
        else:
            cleaned["age"] = age
    if "department" in data or not partial:
        v = _str("department", 80)
        if v is not None:
            cleaned["department"] = v
    if "status" in data or not partial:
        v = data.get("status")
        if v not in ALLOWED_STATUS:
            errors.append(f"status must be one of {sorted(ALLOWED_STATUS)}")
        else:
            cleaned["status"] = v

    return cleaned, errors


@bp.get("")
@require_auth
def list_students():
    q = (request.args.get("q") or "").strip()
    department = (request.args.get("department") or "").strip()
    status = (request.args.get("status") or "").strip()
    page = max(int(request.args.get("page", 1)), 1)
    page_size = min(max(int(request.args.get("pageSize", 10)), 1), 100)

    query = Student.query
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Student.first_name.ilike(like),
                Student.last_name.ilike(like),
                Student.email.ilike(like),
            )
        )
    if department:
        query = query.filter(Student.department == department)
    if status:
        query = query.filter(Student.status == status)

    total = query.count()
    items = (
        query.order_by(Student.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return jsonify(
        {
            "items": [s.to_dict() for s in items],
            "total": total,
            "page": page,
            "pageSize": page_size,
            "totalPages": (total + page_size - 1) // page_size if total else 1,
        }
    )


@bp.get("/<int:student_id>")
@require_auth
def get_student(student_id: int):
    s = Student.query.get(student_id)
    if not s:
        return jsonify({"error": "not_found"}), 404
    return jsonify(s.to_dict())


@bp.post("")
@require_auth
def create_student():
    data = request.get_json(silent=True) or {}
    cleaned, errors = _validate_payload(data)
    if errors:
        return jsonify({"error": "validation_failed", "details": errors}), 400

    student = Student(**cleaned)
    db.session.add(student)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "email_already_exists"}), 409
    return jsonify(student.to_dict()), 201


@bp.put("/<int:student_id>")
@require_auth
def update_student(student_id: int):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "not_found"}), 404

    data = request.get_json(silent=True) or {}
    cleaned, errors = _validate_payload(data, partial=True)
    if errors:
        return jsonify({"error": "validation_failed", "details": errors}), 400

    for k, v in cleaned.items():
        setattr(student, k, v)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "email_already_exists"}), 409
    return jsonify(student.to_dict())


@bp.delete("/<int:student_id>")
@require_auth
def delete_student(student_id: int):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "not_found"}), 404
    db.session.delete(student)
    db.session.commit()
    return "", 204


@bp.get("/meta/departments")
@require_auth
def list_departments():
    rows = db.session.query(Student.department).distinct().all()
    return jsonify(sorted({r[0] for r in rows if r[0]}))


@bp.get("/meta/stats")
@require_auth
def stats():
    """Aggregate counts for the Overview dashboard — single round trip."""
    from sqlalchemy import func

    total = db.session.query(func.count(Student.id)).scalar() or 0

    by_status = dict(
        db.session.query(Student.status, func.count(Student.id))
        .group_by(Student.status)
        .all()
    )
    by_department_rows = (
        db.session.query(Student.department, func.count(Student.id))
        .group_by(Student.department)
        .order_by(func.count(Student.id).desc())
        .all()
    )

    return jsonify(
        {
            "total": total,
            "byStatus": {
                "active": by_status.get("active", 0),
                "inactive": by_status.get("inactive", 0),
                "graduated": by_status.get("graduated", 0),
            },
            "byDepartment": [
                {"name": name, "count": count} for name, count in by_department_rows
            ],
        }
    )
