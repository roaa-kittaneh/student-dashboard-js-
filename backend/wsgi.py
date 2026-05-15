"""Gunicorn entrypoint for production."""
from app import app

if __name__ == "__main__":
    app.run()
