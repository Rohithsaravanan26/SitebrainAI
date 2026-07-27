"""Add project_milestones table and created_by_id to projects

Revision ID: 004_add_project_milestones_audit
Revises: 003_add_projects_rfis
Create Date: 2026-07-27
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '004_add_project_milestones_audit'
down_revision: Union[str, None] = '003_add_projects_rfis'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add created_by_id column to projects table
    op.add_column('projects', sa.Column('created_by_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True))

    # Create project_milestones table
    op.create_table(
        'project_milestones',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('project_id', sa.String(36), sa.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('target_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('status', sa.String(30), nullable=False, server_default='UPCOMING'),
        sa.Column('progress_percent', sa.Float, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('project_milestones')
    op.drop_column('projects', 'created_by_id')
