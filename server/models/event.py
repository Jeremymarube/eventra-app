# models/event.py
from extensions import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    location = db.Column(db.String(200))
    location_name = db.Column(db.String(200))
    price_cents = db.Column(db.Integer, default=0)  # Always in cents
    currency = db.Column(db.String(3), default='KES')
    starts_at = db.Column(db.DateTime, nullable=False)
    ends_at = db.Column(db.DateTime)
    capacity = db.Column(db.Integer)  # Total spots available
    cover_image_url = db.Column(db.String(500))  # URL to cover image
    
    # Host/creator relationship
    host_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    host = db.relationship('User', backref='hosted_events', foreign_keys=[host_id])
    
    # Event lifecycle state: draft, published, live, ended, cancelled
    status = db.Column(db.String(50), default='draft')
    
    is_published = db.Column(db.Boolean, default=False)  # Kept for backward compatibility
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', back_populates='event', cascade='all, delete-orphan')
    saved_by = db.relationship('SavedEvent', back_populates='event', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Event {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'location': self.location,
            'location_name': self.location_name,
            'price_cents': self.price_cents,
            'currency': self.currency,
            'starts_at': self.starts_at.isoformat() if self.starts_at else None,
            'ends_at': self.ends_at.isoformat() if self.ends_at else None,
            'capacity': self.capacity,
            'cover_image_url': self.cover_image_url,
            'status': self.status,
            'host_id': self.host_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }