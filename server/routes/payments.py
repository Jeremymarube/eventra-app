from flask import Blueprint, request, jsonify
import stripe
from extensions import db
from models import Payment
import os

bp = Blueprint('payments', __name__, url_prefix='/api/payments')

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')


@bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.get_json()
        amount = data.get('amount')  # in cents
        currency = data.get('currency', 'usd')

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
        )

        return jsonify({'clientSecret': intent.client_secret}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        payment = Payment(
            stripe_payment_intent_id=intent['id'],
            amount=intent['amount'],
            currency=intent['currency'],
            status='succeeded',
        )
        db.session.add(payment)
        db.session.commit()

    return jsonify({'status': 'success'}), 200
