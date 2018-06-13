"""empty message

Revision ID: 3835a69f0ec5
Revises: 576941b3900c
Create Date: 2018-06-12 20:43:20.335357

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3835a69f0ec5'
down_revision = '576941b3900c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('politicians', sa.Column('birth', sa.String(length=80), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('politicians', 'birth')
    # ### end Alembic commands ###