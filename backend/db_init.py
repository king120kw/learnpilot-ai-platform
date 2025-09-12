import sqlite3

import os

# Define the path for the database file relative to this script
db_folder = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(db_folder, 'viccalary.db')

# Connect to the database (this will create the file if it doesn't exist)
conn = sqlite3.connect(db_path)

# Create a cursor object
c = conn.cursor()

# --- CREATE TABLES ---

# Users Table
c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Profiles Table
c.execute('''
    CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        name TEXT,
        age INTEGER,
        weight REAL,
        weight_unit TEXT,
        height REAL,
        height_unit TEXT,
        gender TEXT,
        goal TEXT,
        activity_level TEXT,
        dietary_preferences TEXT,
        allergies TEXT,
        sleep_hours INTEGER,
        smoking BOOLEAN,
        alcohol BOOLEAN,
        budget REAL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
''')

print("Database and tables created successfully.")

# Commit the changes and close the connection
conn.commit()
conn.close()
