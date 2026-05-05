from flask import Blueprint, jsonify, request
from models import db, Event
from utils.email import send_event_created_email

events_bp = Blueprint("events", __name__)


# GET all events
@events_bp.route("/", methods=["GET"])
def get_events():
    events = Event.query.all()
    return jsonify([e.to_dict() for e in events])


# POST create event
@events_bp.route("/", methods=["POST"])
def create_event():
    data = request.json

    event = Event(
        title=data.get("title"),
        category=data.get("category"),
        location_name=data.get("location_name"),
        starts_at=data.get("starts_at"),
        price_cents=data.get("price_cents"),
        currency=data.get("currency"),
        cover_image_url=data.get("cover_image_url"),
    )

    db.session.add(event)
    db.session.commit()

    # Send "event is live" email to the creator
    try:
        send_event_created_email(event)
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send event created email: {e}")

    return jsonify(event.to_dict()), 201