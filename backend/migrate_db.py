import sqlite3
from pathlib import Path

db_file = Path(__file__).resolve().parent / "jh_safety.db"
print("Migrating DB at:", db_file)
con = sqlite3.connect(db_file)
cur = con.cursor()

cur.execute("PRAGMA table_info(users)")
cols = [row[1] for row in cur.fetchall()]
print("Current columns in users:", cols)

if "last_active" not in cols:
    cur.execute("ALTER TABLE users ADD COLUMN last_active DATETIME")
    cur.execute("UPDATE users SET last_active = created_at WHERE last_active IS NULL")
    con.commit()
    print("Successfully added last_active column.")
else:
    print("last_active column is already present.")

con.close()
