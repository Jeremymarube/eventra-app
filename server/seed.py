# seed.py
from app import create_app
from extensions import db
from models import User, Event
from datetime import datetime
from werkzeug.security import generate_password_hash
import sqlite3

app = create_app()

def seed():
    with app.app_context():
        # Clear existing data - SQLite compatible way
        # Option 1: Just delete without disabling constraints
        db.session.query(Event).delete()
        db.session.query(User).delete()
        
        # Or Option 2: For SQLite, you can enable/disable foreign keys if needed
        # db.session.execute("PRAGMA foreign_keys = OFF")
        # db.session.query(Event).delete()
        # db.session.query(User).delete()
        # db.session.execute("PRAGMA foreign_keys = ON")
        
        # Create a sample user (add fields based on your User model)
        user1 = User(
            username="admin",
            email="admin@example.com",
            password_hash=generate_password_hash("admin123")
        )
        
        # Create event
        event1 = Event(
            title="Tech Conference 2026",
            description="Annual developer meetup and tech talks.",
            category="Tech",
            location="Nairobi",
            location_name="KICC",
            price=1000,
            price_cents=100000,
            currency="KES",
            starts_at=datetime(2026, 6, 1, 10, 0),
            is_published=True
        )

        db.session.add(user1)
        db.session.add(event1)
        db.session.commit()

        print("Seeding complete 🚀")

if __name__ == "__main__":
    seed()