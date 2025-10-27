"""add email verification

Revision ID: 001_email_verification
Revises: 
Create Date: 2024-10-26 18:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_email_verification'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add is_verified column to users table
    op.add_column('users', sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    # Remove is_verified column from users table
    op.drop_column('users', 'is_verified')

