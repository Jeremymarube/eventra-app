from extensions import db
from datetime import datetime
import secrets
import qrcode
from io import BytesIO
import base64

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    
    # Booking details
    quantity = db.Column(db.Integer, default=1)  # Number of tickets
    total_price_cents = db.Column(db.Integer)  # Total price for all tickets
    currency = db.Column(db.String(3), default='KES')
    
    # QR code for check-in
    qr_code = db.Column(db.String(255))  # Unique ticket identifier
    
    # Status: pending, confirmed, checked_in, cancelled, refunded
    status = db.Column(db.String(50), default='confirmed')
    
    # Payment
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'))
    payment = db.relationship('Payment', backref='booking')
    
    # Confirmation & timestamps
    confirmed_at = db.Column(db.DateTime)
    checked_in_at = db.Column(db.DateTime)
    cancelled_at = db.Column(db.DateTime)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='bookings')
    event = db.relationship('Event', backref='bookings_rel')
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Generate unique QR code identifier
        if not self.qr_code:
            self.qr_code = secrets.token_urlsafe(16)
    
    def generate_qr_code_svg(self):
        """Generate QR code SVG for this booking"""
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(f"eventra://ticket/{self.qr_code}")
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        return img
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'user_id': self.user_id,
            'quantity': self.quantity,
            'total_price_cents': self.total_price_cents,
            'currency': self.currency,
            'status': self.status,
            'qr_code': self.qr_code,
            'confirmed_at': self.confirmed_at.isoformat() if self.confirmed_at else None,
            'checked_in_at': self.checked_in_at.isoformat() if self.checked_in_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'event': self.event.to_dict() if self.event else None,
        }
    
    def __repr__(self):
        return f'<Booking {self.id} - User {self.user_id} - Event {self.event_id}>'
