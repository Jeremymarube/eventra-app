from extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    stripe_payment_intent_id = db.Column(db.String(255), unique=True, nullable=False)
    amount = db.Column(db.Integer, nullable=False)  # in cents
    currency = db.Column(db.String(10), default='usd')
    status = db.Column(db.String(50), nullable=False)  # e.g. 'succeeded', 'pending', 'failed'
    
    # Link to user and event
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    
    # Relationships
    user = db.relationship('User', backref='payments')
    event = db.relationship('Event', backref='payments')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Payment {self.stripe_payment_intent_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'stripe_payment_intent_id': self.stripe_payment_intent_id,
            'amount': self.amount,
            'currency': self.currency,
            'status': self.status,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }