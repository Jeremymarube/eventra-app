from flask import Blueprint, request, jsonify
from intasend import APIService
from extensions import db
from models import Payment
import os

bp = Blueprint('payments', __name__, url_prefix='/api/payments')

def get_intasend():
    return APIService(
        token=os.environ.get('INTASEND_SECRET_KEY'),
        publishable_key=os.environ.get('INTASEND_PUBLISHABLE_KEY'),
        test=os.environ.get('INTASEND_TEST_MODE', 'true').lower() == 'true'
    )

# Initiate M-Pesa STK Push
@bp.route('/mpesa/initiate', methods=['POST'])
def initiate_mpesa():
    try:
        data = request.get_json()
        phone_number = data.get('phone_number')  # e.g. 2547XXXXXXXX
        amount = data.get('amount')  # in KES
        event_id = data.get('event_id')
        user_id = data.get('user_id')
        narrative = data.get('narrative', 'Event Ticket Payment')

        service = get_intasend()
        response = service.collect.mpesa_stk_push(
            phone_number=phone_number,
            amount=amount,
            narrative=narrative
        )

        # Save pending payment
        payment = Payment(
            intasend_invoice_id=response['invoice']['invoice_id'],
            amount=amount,
            currency='KES',
            status='pending',
            phone_number=phone_number,
            user_id=user_id,
            event_id=event_id
        )
        db.session.add(payment)
        db.session.commit()

        return jsonify({
            'invoice_id': response['invoice']['invoice_id'],
            'status': 'pending',
            'message': 'STK push sent to your phone. Enter M-Pesa PIN to complete.'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Check payment status
@bp.route('/mpesa/status/<invoice_id>', methods=['GET'])
def check_status(invoice_id):
    try:
        service = get_intasend()
        response = service.collect.status(invoice_id=invoice_id)
        
        # Update payment in DB
        payment = Payment.query.filter_by(intasend_invoice_id=invoice_id).first()
        if payment:
            payment.status = response['invoice']['state'].lower()
            db.session.commit()

        return jsonify({
            'invoice_id': invoice_id,
            'status': response['invoice']['state']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Webhook for IntaSend callbacks
@bp.route('/webhook', methods=['POST'])
def webhook():
    try:
        data = request.get_json()
        invoice_id = data.get('invoice_id')
        state = data.get('state')

        payment = Payment.query.filter_by(intasend_invoice_id=invoice_id).first()
        if payment:
            payment.status = state.lower()
            db.session.commit()

        return jsonify({'status': 'ok'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400
