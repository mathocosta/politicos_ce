"""empty message

Revision ID: 243ccac76918
Revises: f3203eb5496c
Create Date: 2018-05-05 16:43:53.987499

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '243ccac76918'
down_revision = 'f3203eb5496c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('politicians',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('civil_name', sa.String(length=80), nullable=True),
    sa.Column('parliamentary_name', sa.String(length=80), nullable=True),
    sa.Column('party_siglum', sa.String(length=80), nullable=True),
    sa.Column('scholarity', sa.String(length=80), nullable=True),
    sa.Column('hometown', sa.String(length=80), nullable=True),
    sa.Column('position', sa.String(length=80), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('politicians')
    # ### end Alembic commands ###