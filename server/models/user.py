from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(100), default='')
    password_hash = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text, default='')
    profile_image = db.Column(db.String(500))  # URL to profile image
    
    # User role: 'attendee' or 'host' or 'admin'
    role = db.Column(db.String(50), default='attendee')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.username,
            'bio': self.bio,
            'profile_image': self.profile_image,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }