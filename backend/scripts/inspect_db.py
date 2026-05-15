"""Quick CLI dump of the SQLite DB — no third-party tool needed.

Usage:
    python scripts/inspect_db.py
"""
import os
import sqlite3
import sys

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "students.db")


def main() -> int:
    if not os.path.exists(DB_PATH):
        print(f"DB not found at {DB_PATH}")
        print("Run `python app.py` once to create it.")
        return 1

    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    tables = [r[0] for r in cur.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )]
    print(f"DB: {os.path.abspath(DB_PATH)}")
    print(f"Tables: {tables}\n")

    for table in tables:
        count = cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"── {table}  ({count} rows) " + "─" * 40)
        rows = cur.execute(f"SELECT * FROM {table} LIMIT 20").fetchall()
        if not rows:
            print("  (empty)\n")
            continue
        cols = rows[0].keys()
        widths = {c: max(len(c), *(len(str(r[c])) for r in rows)) for c in cols}
        header = " | ".join(c.ljust(widths[c]) for c in cols)
        print(header)
        print("-" * len(header))
        for r in rows:
            print(" | ".join(str(r[c]).ljust(widths[c]) for c in cols))
        print()

    con.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
