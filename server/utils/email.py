import qrcode
import base64
from io import BytesIO
from flask_mail import Message
from extensions import mail


# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def generate_qr_base64(data: str) -> str:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=8,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def send_email(subject, recipients, html):
    msg = Message(subject=subject, recipients=recipients)
    msg.html = html
    mail.send(msg)


def base_template(content: str) -> str:
    """Wraps content in a consistent email shell."""
    return f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
        <div style="background: #4F46E5; padding: 25px 30px;">
          <h2 style="color: white; margin: 0;">Eventra</h2>
        </div>
        <div style="padding: 30px;">
          {content}
        </div>
        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
          Powered by Eventra · You're receiving this because you have an account with us.
        </div>
      </div>
    </body>
    </html>
    """


# ─────────────────────────────────────────────
# CREATOR EMAILS
# ─────────────────────────────────────────────

def send_event_created_email(event):
    """Triggered when creator publishes/creates an event."""
    content = f"""
        <h2 style="color: #4F46E5;">Your event is live! 🚀</h2>
        <p>Hi <strong>{event.host.username}</strong>,</p>
        <p>Your event has been successfully created and is now live on Eventra.</p>

        <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Event</td>
            <td style="padding:10px 0;"><strong>{event.title}</strong></td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Date</td>
            <td style="padding:10px 0;">{event.starts_at.strftime('%A, %B %d %Y at %I:%M %p')}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Location</td>
            <td style="padding:10px 0;">{event.location or 'TBA'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#666;">Price</td>
            <td style="padding:10px 0;">
              {'Free' if not event.price_cents else f'{event.currency} {event.price_cents / 100:,.2f}'}
            </td>
          </tr>
        </table>

        <p style="color:#666; font-size:14px;">
          Share your event link with your audience and start getting bookings!
        </p>
    """
    send_email(
        subject=f"Your event \"{event.title}\" is now live!",
        recipients=[event.host.email],
        html=base_template(content)
    )


def send_new_booking_alert_email(event, booking):
    """Triggered when someone books the creator's event."""
    content = f"""
        <h2 style="color: #4F46E5;">New booking received! 🎟️</h2>
        <p>Hi <strong>{event.host.username}</strong>,</p>
        <p>Someone just booked a spot at your event <strong>{event.title}</strong>.</p>

        <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Attendee</td>
            <td style="padding:10px 0;"><strong>{booking.user.username}</strong></td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Email</td>
            <td style="padding:10px 0;">{booking.user.email}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Booking Ref</td>
            <td style="padding:10px 0;"><strong>{booking.qr_code}</strong></td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#666;">Amount Paid</td>
            <td style="padding:10px 0;">
              {'Free' if not event.price_cents else f'{event.currency} {event.price_cents / 100:,.2f}'}
            </td>
          </tr>
        </table>

        <p style="color:#666; font-size:14px;">Log in to your dashboard to see all bookings.</p>
    """
    send_email(
        subject=f"New booking for \"{event.title}\"",
        recipients=[event.host.email],
        html=base_template(content)
    )


def send_event_reminder_to_creator_email(event, days_left):
    """Triggered X days before the event."""
    content = f"""
        <h2 style="color: #4F46E5;">Your event is in {days_left} day(s)! ⏰</h2>
        <p>Hi <strong>{event.host.username}</strong>,</p>
        <p>Just a reminder that your event <strong>{event.title}</strong> is coming up soon.</p>

        <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Date</td>
            <td style="padding:10px 0;">{event.starts_at.strftime('%A, %B %d %Y at %I:%M %p')}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#666;">Location</td>
            <td style="padding:10px 0;">{event.location or 'TBA'}</td>
          </tr>
        </table>

        <p style="color:#666; font-size:14px;">
          Make sure everything is ready. Log in to your dashboard to review your attendee list.
        </p>
    """
    send_email(
        subject=f"Reminder: \"{event.title}\" is in {days_left} day(s)",
        recipients=[event.host.email],
        html=base_template(content)
    )


def send_event_ended_summary_email(event, total_bookings, total_revenue):
    """Triggered after event ends."""
    content = f"""
        <h2 style="color: #4F46E5;">Your event has ended 🎊</h2>
        <p>Hi <strong>{event.host.username}</strong>,</p>
        <p>Here's a summary for <strong>{event.title}</strong>:</p>

        <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Total Bookings</td>
            <td style="padding:10px 0;"><strong>{total_bookings}</strong></td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Total Revenue</td>
            <td style="padding:10px 0;">
              <strong>{event.currency} {total_revenue / 100:,.2f}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#666;">Event Date</td>
            <td style="padding:10px 0;">{event.starts_at.strftime('%A, %B %d %Y')}</td>
          </tr>
        </table>

        <p style="color:#666; font-size:14px;">
          Thank you for hosting on Eventra. We hope it was a great event!
        </p>
    """
    send_email(
        subject=f"Summary for \"{event.title}\"",
        recipients=[event.host.email],
        html=base_template(content)
    )


# ─────────────────────────────────────────────
# ATTENDEE EMAILS
# ─────────────────────────────────────────────

def send_ticket_email(booking):
    """Triggered when booking is confirmed."""
    qr_base64 = generate_qr_base64(f"EVENTRA-BOOKING:{booking.qr_code}")

    content = f"""
        <h2 style="color: #4F46E5;">You're going! 🎉</h2>
        <p>Hi <strong>{booking.user.username}</strong>,</p>
        <p>Your booking is confirmed. Here are your event details:</p>

        <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Event</td>
            <td style="padding:10px 0;"><strong>{booking.event.title}</strong></td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Date</td>
            <td style="padding:10px 0;">{booking.event.starts_at.strftime('%A, %B %d %Y at %I:%M %p')}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Location</td>
            <td style="padding:10px 0;">{booking.event.location or 'TBA'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#666;">Booking Ref</td>
            <td style="padding:10px 0;"><strong>{booking.qr_code}</strong></td>
          </tr>
        </table>

        <!-- QR Code -->
        <div style="text-align:center; margin:30px 0; padding:20px; background:#f9f9f9; border-radius:8px;">
          <p style="color:#444; font-size:14px; margin-bottom:12px;">
            Show this QR code at the event entrance
          </p>
          <img src="data:image/png;base64,{qr_base64}" alt="Booking QR Code"
               style="width:180px; height:180px;" />
          <p style="color:#999; font-size:12px; margin-top:10px;">
            Ref: <strong>{booking.qr_code}</strong>
          </p>
        </div>

        <p style="color:#666; font-size:14px;">
          Please keep this email as your ticket. You may be asked to show it at the event entrance.
        </p>
    """
    send_email(
        subject=f"Your ticket for {booking.event.title}",
        recipients=[booking.user.email],
        html=base_template(content)
    )


def send_attendee_reminder_email(booking, days_left):
    """Triggered X days before the event."""
    content = f"""
        <h2 style="color: #4F46E5;">Your event is in {days_left} day(s)! ⏰</h2>
        <p>Hi <strong>{booking.user.username}</strong>,</p>
        <p>Just a reminder that you have a booking for <strong>{booking.event.title}</strong>.</p>

        <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Date</td>
            <td style="padding:10px 0;">{booking.event.starts_at.strftime('%A, %B %d %Y at %I:%M %p')}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#666;">Location</td>
            <td style="padding:10px 0;">{booking.event.location or 'TBA'}</td>
          </tr>
        </table>

        <p style="color:#666; font-size:14px;">
          Don't forget to bring this email or your booking reference: <strong>{booking.qr_code}</strong>
        </p>
    """
    send_email(
        subject=f"Reminder: \"{booking.event.title}\" is in {days_left} day(s)",
        recipients=[booking.user.email],
        html=base_template(content)
    )


def send_event_cancelled_email(booking):
    """Triggered when an event is cancelled."""
    content = f"""
        <h2 style="color: #DC2626;">Event Cancelled 😔</h2>
        <p>Hi <strong>{booking.user.username}</strong>,</p>
        <p>We're sorry to let you know that <strong>{booking.event.title}</strong> has been cancelled
        by the organiser.</p>

        <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0; color:#666;">Event</td>
            <td style="padding:10px 0;"><strong>{booking.event.title}</strong></td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#666;">Booking Ref</td>
            <td style="padding:10px 0;">{booking.qr_code}</td>
          </tr>
        </table>

        <p style="color:#666; font-size:14px;">
          If you paid for this event, a refund will be processed shortly.
          We apologise for any inconvenience caused.
        </p>
    """
    send_email(
        subject=f"\"{booking.event.title}\" has been cancelled",
        recipients=[booking.user.email],
        html=base_template(content)
    )


def send_post_event_thankyou_email(booking):
    """Triggered after the event ends."""
    content = f"""
        <h2 style="color: #4F46E5;">Thanks for attending! 🙌</h2>
        <p>Hi <strong>{booking.user.username}</strong>,</p>
        <p>We hope you had a great time at <strong>{booking.event.title}</strong>!</p>

        <p style="color:#666; font-size:14px;">
          Keep an eye on Eventra for more upcoming events. We'd love to see you again!
        </p>
    """
    send_email(
        subject=f"Thanks for attending \"{booking.event.title}\"!",
        recipients=[booking.user.email],
        html=base_template(content)
    )