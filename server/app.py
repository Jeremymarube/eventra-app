from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from config import Config
from extensions import db, migrate, mail
from models import Event, User, Booking, SavedEvent, Payment
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps
from authlib.integrations.flask_client import OAuth
from flask_mail import Mail
import os
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # initialize shared extensions
    mail.init_app(app)

    # configure OpenAI if key provided
    
    # Configure CORS for development (allow Next.js to connect)
    CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "https://eventra-app-koyx.vercel.app"
], supports_credentials=True)
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Import models
    from models import User, Event, Booking, SavedEvent, Payment

    # ─── GOOGLE OAUTH SETUP ──────────────────────────────────────────────────
    oauth = OAuth(app)
    google = oauth.register(
        name='google',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'},
    )

    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            
            if not token:
                return jsonify({'error': 'Token is missing'}), 401
            
            try:
                # Remove 'Bearer ' prefix if present
                if token.startswith('Bearer '):
                    token = token[7:]
                
                # Decode token
                payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                current_user = User.query.get(payload['user_id'])
                
                if not current_user:
                    return jsonify({'error': 'User not found'}), 401
                    
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token'}), 401
                
            return f(current_user, *args, **kwargs)
        
        return decorated
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'healthy',
            'database': 'SQLite',
            'message': 'Flask backend is running!'
        })
    
    # ─── GOOGLE AUTH ENDPOINTS ───────────────────────────────────────────────

    @app.route('/api/auth/google/login')
    def google_login():
        redirect_uri = os.getenv('GOOGLE_REDIRECT_URI')
        return google.authorize_redirect(redirect_uri)

    @app.route('/api/auth/google/callback')
    def google_callback():
        try:
            token = google.authorize_access_token()
            user_info = token.get('userinfo')

            if not user_info:
                return redirect('http://localhost:3000/login?error=Failed to get user info from Google')

            # Check if user already exists by email
            user = User.query.filter_by(email=user_info['email']).first()

            if not user:
                # Create new user from Google info
                user = User(
                    email=user_info['email'],
                    username=user_info.get('name', ''),
                    password_hash=generate_password_hash(os.urandom(24).hex()),  # random secure password
                    google_id=user_info['sub'],
                    picture=user_info.get('picture', '')
                )
                db.session.add(user)
                db.session.commit()
            else:
                # Update google_id and picture if not already set
                needs_update = False
                if not getattr(user, 'google_id', None):
                    user.google_id = user_info['sub']
                    needs_update = True
                if not getattr(user, 'picture', None):
                    user.picture = user_info.get('picture', '')
                    needs_update = True
                if needs_update:
                    db.session.commit()

            # Generate JWT token (same as regular login)
            jwt_token = jwt.encode(
                {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=24)},
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )

            # Redirect to Next.js with token and user info
            frontend_url = (
                f"http://localhost:3000/auth/callback"
                f"?token={jwt_token}"
                f"&name={user.username}"
                f"&email={user.email}"
                f"&picture={getattr(user, 'picture', '')}"
            )
            return redirect(frontend_url)

        except Exception as e:
            return redirect(f'http://localhost:3000/login?error={str(e)}')

    # ─── STANDARD AUTH ENDPOINTS ─────────────────────────────────────────────

    # User registration
    @app.route('/api/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            
            # Validate required fields
            if not data.get('email') or not data.get('password'):
                return jsonify({'error': 'Email and password are required'}), 400
            
            # Check if user already exists
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                return jsonify({'error': 'User already exists'}), 400
            
            # Create new user
            hashed_password = generate_password_hash(data['password'])
            user = User(
                email=data['email'],
                username=data.get('name', ''),
                password_hash=hashed_password
            )
            
            db.session.add(user)
            db.session.commit()
            
            # Create token
            token = jwt.encode(
                {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=24)},
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )
            
            return jsonify({
                'message': 'User created successfully',
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.username
                }
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # User login
    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
            # Validate required fields
            if not data.get('email') or not data.get('password'):
                return jsonify({'error': 'Email and password are required'}), 400
            
            # Find user by email
            user = User.query.filter_by(email=data['email']).first()
            
            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Check password
            if not check_password_hash(user.password_hash, data['password']):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Create token
            token = jwt.encode(
                {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=24)},
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )
            
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.username
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    
    # Get current user profile (protected)
    @app.route('/api/me', methods=['GET'])
    @token_required
    def get_current_user(current_user):
        return jsonify({
            'id': current_user.id,
            'email': current_user.email,
            'name': current_user.username,
            'picture': getattr(current_user, 'picture', ''),
            'joined': current_user.created_at.strftime('%B %Y') if current_user.created_at else 'April 2026'
        }), 200
    
    # Profile endpoints
    @app.route('/api/profile', methods=['GET'])
    @token_required
    def get_profile(current_user):
        # Compute real stats from the database where possible
        try:
            saved_count = SavedEvent.query.filter_by(user_id=current_user.id).count()
        except Exception:
            saved_count = 0

        try:
            attended_count = Booking.query.filter_by(user_id=current_user.id, status='confirmed').count()
        except Exception:
            attended_count = 0

        # 'Following' is not implemented yet; default to 0
        following_count = 0

        return jsonify({
            'id': current_user.id,
            'name': current_user.username,
            'email': current_user.email,
            'picture': getattr(current_user, 'picture', ''),
            'joined': current_user.created_at.strftime('%B %Y') if current_user.created_at else 'April 2026',
            'bio': getattr(current_user, 'bio', ''),
            'avatar': current_user.username[0] if current_user.username else 'U',
            'avatarColor': 'hsl(28, 60%, 82%)',
            'stats': [
                {'label': 'Events saved', 'value': str(saved_count)},
                {'label': 'Events attended', 'value': str(attended_count)},
                {'label': 'Following', 'value': f"{following_count} hosts"}
            ]
        })

    @app.route('/api/profile', methods=['DELETE'])
    @token_required
    def delete_profile(current_user):
        try:
            # Remove saved events
            SavedEvent.query.filter_by(user_id=current_user.id).delete()
            # Remove bookings
            Booking.query.filter_by(user_id=current_user.id).delete()
            # Optionally, remove events hosted by this user (and related bookings)
            host_events = Event.query.filter_by(host_id=current_user.id).all()
            for ev in host_events:
                Booking.query.filter_by(event_id=ev.id).delete()
                db.session.delete(ev)

            db.session.delete(current_user)
            db.session.commit()
            return jsonify({'message': 'Account deleted'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    # Simple image upload endpoint used by the Next.js client when creating events
    @app.route('/api/upload', methods=['POST'])
    @token_required
    def upload_image(current_user):
        from werkzeug.utils import secure_filename
        import os

        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        image = request.files['image']
        if image.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        uploads_dir = os.path.join(app.root_path, 'static', 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)

        filename = secure_filename(image.filename)
        # prefix with timestamp to avoid collisions
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        filename = f"{timestamp}_{filename}"
        file_path = os.path.join(uploads_dir, filename)

        try:
            image.save(file_path)
            # Flask serves files under /static/<path>
            image_url = f"/static/uploads/{filename}"
            return jsonify({'imageUrl': image_url}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/profile', methods=['PUT'])
    @token_required
    def update_profile(current_user):
        try:
            data = request.get_json()
            
            if 'name' in data:
                current_user.username = data['name']
            if 'bio' in data:
                current_user.bio = data['bio']
            
            db.session.commit()
            
            return jsonify({
                'message': 'Profile updated successfully',
                'user': {
                    'id': current_user.id,
                    'email': current_user.email,
                    'name': current_user.username,
                    'bio': getattr(current_user, 'bio', '')
                }
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # ─── EVENT ENDPOINTS ─────────────────────────────────────────────────────

    # Get all events
    @app.route('/api/events', methods=['GET'])
    def get_events():
        category = request.args.get('category')
        published_only = request.args.get('published', 'true').lower() == 'true'
        
        query = Event.query
        if published_only:
            query = query.filter_by(is_published=True)
        if category:
            query = query.filter_by(category=category)
        
        events = query.all()
        return jsonify([event.to_dict() for event in events])
    
    # Get single event
    @app.route('/api/events/<int:event_id>', methods=['GET'])
    def get_event(event_id):
        event = Event.query.get_or_404(event_id)
        return jsonify(event.to_dict())
    
    # Create new event (protected)
    @app.route('/api/events', methods=['POST'])
    @token_required
    def create_event(current_user):
        data = request.get_json()
        
        try:
            event = Event(
                title=data['title'],
                description=data.get('description', ''),
                category=data.get('category', 'General'),
                location=data.get('location', ''),
                location_name=data.get('location_name', ''),
                price_cents=data.get('price_cents', 0),
                currency=data.get('currency', 'KES'),
                starts_at=datetime.fromisoformat(data['starts_at'].replace('Z', '+00:00')) if data.get('starts_at') else None,
                ends_at=datetime.fromisoformat(data['ends_at'].replace('Z', '+00:00')) if data.get('ends_at') else None,
                capacity=data.get('capacity'),
                cover_image_url=data.get('cover_image_url'),
                status=data.get('status', 'draft'),
                is_published=data.get('is_published', False),
                host_id=current_user.id
            )
            
            db.session.add(event)
            db.session.commit()

            # send creator email (best-effort)
            try:
                from utils.email import send_event_created_email
                send_event_created_email(event)
            except Exception as e:
                print(f"[EMAIL ERROR] {e}")

            # create an in-app notification for the host
            try:
                from models import Notification
                n = Notification(user_id=current_user.id, message=f'Your event "{event.title}" is now live')
                db.session.add(n)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(f"[NOTIF ERROR] {e}")

            return jsonify({
                'message': 'Event created successfully',
                'event': event.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # Update event (protected - only host can edit)
    @app.route('/api/events/<int:event_id>', methods=['PUT'])
    @token_required
    def update_event(current_user, event_id):
        event = Event.query.get_or_404(event_id)
        
        if event.host_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        try:
            if 'title' in data:
                event.title = data['title']
            if 'description' in data:
                event.description = data['description']
            if 'category' in data:
                event.category = data['category']
            if 'location' in data:
                event.location = data['location']
            if 'location_name' in data:
                event.location_name = data['location_name']
            if 'price_cents' in data:
                event.price_cents = data['price_cents']
            if 'currency' in data:
                event.currency = data['currency']
            if 'starts_at' in data:
                event.starts_at = datetime.fromisoformat(data['starts_at'].replace('Z', '+00:00'))
            if 'ends_at' in data:
                event.ends_at = datetime.fromisoformat(data['ends_at'].replace('Z', '+00:00'))
            if 'capacity' in data:
                event.capacity = data['capacity']
            if 'cover_image_url' in data:
                event.cover_image_url = data['cover_image_url']
            if 'status' in data:
                event.status = data['status']
            if 'is_published' in data:
                event.is_published = data['is_published']
            
            event.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({'message': 'Event updated', 'event': event.to_dict()}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # Delete event (protected - only host can delete)
    @app.route('/api/events/<int:event_id>', methods=['DELETE'])
    @token_required
    def delete_event(current_user, event_id):
        event = Event.query.get_or_404(event_id)
        
        if event.host_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        try:
            db.session.delete(event)
            db.session.commit()
            return jsonify({'message': 'Event deleted'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    # Notifications
    @app.route('/api/notifications', methods=['GET'])
    @token_required
    def get_notifications(current_user):
        from models import Notification
        notes = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).all()
        return jsonify([{
            'id': n.id,
            'message': n.message,
            'is_read': n.is_read,
            'created_at': n.created_at.isoformat()
        } for n in notes])

    @app.route('/api/notifications/mark-read', methods=['POST'])
    @token_required
    def mark_notifications_read(current_user):
        data = request.get_json() or {}
        ids = data.get('ids')
        from models import Notification
        try:
            if ids and isinstance(ids, list):
                Notification.query.filter(Notification.user_id == current_user.id, Notification.id.in_(ids)).update({'is_read': True}, synchronize_session=False)
            else:
                Notification.query.filter_by(user_id=current_user.id, is_read=False).update({'is_read': True}, synchronize_session=False)
            db.session.commit()
            return jsonify({'message': 'Notifications marked read'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    # AI description generator
    @app.route('/api/events/generate-description', methods=['POST'])
    @token_required
    def generate_description(current_user):
        import requests as http_requests
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return jsonify({'error': 'Gemini API key not configured'}), 500
        data = request.get_json() or {}
        title = data.get('title', '')
        category = data.get('category', '')
        location = data.get('location_name') or data.get('location') or ''
        prompt = (
            f"Write a short (1-3 paragraph), engaging event description for an event titled \"{title}\" "
            f"in the category \"{category}\" taking place at \"{location}\". Emphasize what makes it special and include a call-to-action to book a ticket."
        )
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            resp = http_requests.post(url, json=payload)
            resp.raise_for_status()
            text = resp.json()['candidates'][0]['content']['parts'][0]['text'].strip()
            return jsonify({'description': text}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
   
    
    # ─── BOOKING ENDPOINTS ───────────────────────────────────────────────────
    
    # Create booking (protected)
    @app.route('/api/bookings', methods=['POST'])
    @token_required
    def create_booking(current_user):
        data = request.get_json()
        
        try:
            event = Event.query.get_or_404(data['event_id'])
            
            if event.capacity:
                booked_count = Booking.query.filter_by(event_id=event.id).filter(Booking.status != 'cancelled').count()
                if booked_count >= event.capacity:
                    return jsonify({'error': 'Event is full'}), 400
            
            booking = Booking(
                user_id=current_user.id,
                event_id=event.id,
                quantity=data.get('quantity', 1),
                total_price_cents=data.get('total_price_cents', event.price_cents),
                currency=event.currency,
                status='confirmed',
                confirmed_at=datetime.utcnow()
            )
            
            db.session.add(booking)
            db.session.commit()

            # Send ticket email to attendee
            try:
                from utils.email import send_ticket_email
                send_ticket_email(booking)
            except Exception as e:
                print(f"[EMAIL ERROR] {e}")

            return jsonify({
                'message': 'Booking created',
                'booking': booking.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # Get user's bookings (protected)
    @app.route('/api/bookings', methods=['GET'])
    @token_required
    def get_bookings(current_user):
        status = request.args.get('status')
        
        query = Booking.query.filter_by(user_id=current_user.id)
        if status:
            query = query.filter_by(status=status)
        
        bookings = query.all()
        return jsonify([booking.to_dict() for booking in bookings])
    
    # Get single booking (protected)
    @app.route('/api/bookings/<int:booking_id>', methods=['GET'])
    @token_required
    def get_booking(current_user, booking_id):
        booking = Booking.query.get_or_404(booking_id)
        
        if booking.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify(booking.to_dict())
    
    # Cancel booking (protected)
    @app.route('/api/bookings/<int:booking_id>/cancel', methods=['POST'])
    @token_required
    def cancel_booking(current_user, booking_id):
        booking = Booking.query.get_or_404(booking_id)
        
        if booking.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if booking.status == 'cancelled':
            return jsonify({'error': 'Booking already cancelled'}), 400
        
        try:
            booking.status = 'cancelled'
            booking.cancelled_at = datetime.utcnow()
            db.session.commit()
            return jsonify({'message': 'Booking cancelled', 'booking': booking.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # Check in booking (protected - host only)
    @app.route('/api/bookings/<int:booking_id>/checkin', methods=['POST'])
    @token_required
    def checkin_booking(current_user, booking_id):
        booking = Booking.query.get_or_404(booking_id)
        event = booking.event
        
        if event.host_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        try:
            booking.status = 'checked_in'
            booking.checked_in_at = datetime.utcnow()
            db.session.commit()
            return jsonify({'message': 'Attendee checked in', 'booking': booking.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # ─── SAVED EVENTS ENDPOINTS ──────────────────────────────────────────────
    
    # Save event (protected)
    @app.route('/api/saved-events', methods=['POST'])
    @token_required
    def save_event(current_user):
        data = request.get_json()
        
        try:
            existing = SavedEvent.query.filter_by(
                user_id=current_user.id,
                event_id=data['event_id']
            ).first()
            
            if existing:
                return jsonify({'error': 'Event already saved'}), 400
            
            saved_event = SavedEvent(
                user_id=current_user.id,
                event_id=data['event_id']
            )
            
            db.session.add(saved_event)
            db.session.commit()
            
            return jsonify({'message': 'Event saved'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # Get saved events (protected)
    @app.route('/api/saved-events', methods=['GET'])
    @token_required
    def get_saved_events(current_user):
        saved_events = SavedEvent.query.filter_by(user_id=current_user.id).all()
        return jsonify([
            {
                'id': se.id,
                'event': se.event.to_dict() if se.event else None,
                'saved_at': se.created_at.isoformat()
            } for se in saved_events
        ])
    
    # Unsave event (protected)
    @app.route('/api/saved-events/<int:event_id>', methods=['DELETE'])
    @token_required
    def unsave_event(current_user, event_id):
        saved_event = SavedEvent.query.filter_by(
            user_id=current_user.id,
            event_id=event_id
        ).first_or_404()
        
        try:
            db.session.delete(saved_event)
            db.session.commit()
            return jsonify({'message': 'Event unsaved'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    # ─── HOST DASHBOARD ENDPOINTS ────────────────────────────────────────────
    
    # Get host's events (protected)
    @app.route('/api/host/events', methods=['GET'])
    @token_required
    def get_host_events(current_user):
        status = request.args.get('status')
        
        query = Event.query.filter_by(host_id=current_user.id)
        if status:
            query = query.filter_by(status=status)
        
        events = query.all()
        return jsonify([event.to_dict() for event in events])
    
    # Get event attendees (protected - host only)
    @app.route('/api/host/events/<int:event_id>/attendees', methods=['GET'])
    @token_required
    def get_event_attendees(current_user, event_id):
        event = Event.query.get_or_404(event_id)
        
        if event.host_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        bookings = Booking.query.filter_by(event_id=event_id, status='confirmed').all()
        return jsonify([
            {
                'id': b.id,
                'user': {
                    'id': b.user.id,
                    'name': b.user.username,
                    'email': b.user.email
                },
                'quantity': b.quantity,
                'checked_in_at': b.checked_in_at.isoformat() if b.checked_in_at else None,
                'qr_code': b.qr_code
            } for b in bookings
        ])
    
    # Get event analytics (protected - host only)
    @app.route('/api/host/events/<int:event_id>/analytics', methods=['GET'])
    @token_required
    def get_event_analytics(current_user, event_id):
        event = Event.query.get_or_404(event_id)
        
        if event.host_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        total_bookings = Booking.query.filter_by(event_id=event_id, status='confirmed').count()
        cancelled_bookings = Booking.query.filter_by(event_id=event_id, status='cancelled').count()
        checked_in = Booking.query.filter_by(event_id=event_id, status='checked_in').count()
        
        total_revenue = db.session.query(db.func.sum(Booking.total_price_cents)).filter(
            Booking.event_id == event_id,
            Booking.status == 'confirmed'
        ).scalar() or 0
        
        return jsonify({
            'event_id': event_id,
            'total_bookings': total_bookings,
            'cancelled_bookings': cancelled_bookings,
            'checked_in': checked_in,
            'total_revenue': total_revenue,
            'revenue_currency': event.currency
        })
    
    # Home route
    @app.route('/api', methods=['GET'])
    def home():
        return jsonify({
            'message': 'Welcome to Eventra API',
            'version': '2.0.0',
            'endpoints': {
                'auth': [
                    'POST /api/register',
                    'POST /api/login',
                    'GET /api/auth/google/login',
                    'GET /api/auth/google/callback',
                    'GET /api/me',
                    'GET /api/profile',
                    'PUT /api/profile',
                ],
                'events': [
                    'GET /api/events',
                    'GET /api/events/<id>',
                    'POST /api/events (protected)',
                    'PUT /api/events/<id> (protected)',
                    'DELETE /api/events/<id> (protected)',
                ],
                'bookings': [
                    'POST /api/bookings (protected)',
                    'GET /api/bookings (protected)',
                    'GET /api/bookings/<id> (protected)',
                    'POST /api/bookings/<id>/cancel (protected)',
                    'POST /api/bookings/<id>/checkin (protected)',
                ],
                'saved': [
                    'POST /api/saved-events (protected)',
                    'GET /api/saved-events (protected)',
                    'DELETE /api/saved-events/<event_id> (protected)',
                ],
                'host': [
                    'GET /api/host/events (protected)',
                    'GET /api/host/events/<id>/attendees (protected)',
                    'GET /api/host/events/<id>/analytics (protected)',
                ]
            }
        })
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
