from extensions import db
from datetime import datetime

class SavedEvent(db.Model):
    __tablename__ = 'saved_events'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='saved_events')
    event = db.relationship('Event', backref='saved_events_rel')
    
    def __repr__(self):
        return f'<SavedEvent {self.user_id} - {self.event_id}>'
