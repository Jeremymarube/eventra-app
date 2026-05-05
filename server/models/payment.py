from extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    intasend_invoice_id = db.Column(db.String(255), unique=True, nullable=False)
    amount = db.Column(db.Integer, nullable=False)  # in KES
    currency = db.Column(db.String(10), default='KES')
    status = db.Column(db.String(50), nullable=False)  # pending, complete, failed
    phone_number = db.Column(db.String(20))  # M-Pesa phone number

    # Link to user and event
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))

    # Relationships
    user = db.relationship('User', backref='payments')
    event = db.relationship('Event', backref='payments')

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Payment {self.intasend_invoice_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'intasend_invoice_id': self.intasend_invoice_id,
            'amount': self.amount,
            'currency': self.currency,
            'status': self.status,
            'phone_number': self.phone_number,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
