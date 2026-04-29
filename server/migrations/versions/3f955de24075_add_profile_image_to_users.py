"""add profile_image to users

Revision ID: 3f955de24075
Revises: e29f2ded3b55
Create Date: 2026-04-28 11:51:39.215897

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3f955de24075'
down_revision = 'e29f2ded3b55'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('saved_events',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bookings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=True),
    sa.Column('total_price_cents', sa.Integer(), nullable=True),
    sa.Column('currency', sa.String(length=3), nullable=True),
    sa.Column('qr_code', sa.String(length=255), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('payment_id', sa.Integer(), nullable=True),
    sa.Column('confirmed_at', sa.DateTime(), nullable=True),
    sa.Column('checked_in_at', sa.DateTime(), nullable=True),
    sa.Column('cancelled_at', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ),
    sa.ForeignKeyConstraint(['payment_id'], ['payments.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ends_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('capacity', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('cover_image_url', sa.String(length=500), nullable=True))
        batch_op.add_column(sa.Column('host_id',sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('status', sa.String(length=50), nullable=True))
        batch_op.create_foreign_key('fk_events_host_id_users', 'users', ['host_id'], ['id'])
        batch_op.drop_column('price')

    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('event_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))
        batch_op.create_foreign_key('fk_payments_user_id_users', 'users', ['user_id'], ['id'])
        batch_op.create_foreign_key('fk_payments_event_id_events', 'events', ['event_id'], ['id'])

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('profile_image', sa.String(length=500), nullable=True))
        batch_op.add_column(sa.Column('role', sa.String(length=50), nullable=True))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('role')
        batch_op.drop_column('profile_image')

    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.drop_constraint('fk_payments_user_id_users', type_='foreignkey')
        batch_op.drop_constraint('fk_payments_event_id_events', type_='foreignkey')
        batch_op.drop_column('updated_at')
        batch_op.drop_column('event_id')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('price', sa.INTEGER(), nullable=True))
        batch_op.drop_constraint('fk_events_host_id_users', type_='foreignkey')
        batch_op.drop_column('status')
        batch_op.drop_column('host_id')
        batch_op.drop_column('cover_image_url')
        batch_op.drop_column('capacity')
        batch_op.drop_column('ends_at')

    op.drop_table('bookings')
    op.drop_table('saved_events')
