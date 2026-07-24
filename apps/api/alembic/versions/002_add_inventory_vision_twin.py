"""Add inventory, vision, and digital twin tables

Revision ID: 002_add_inventory_vision_twin
Revises: 001_create_auth_tables
Create Date: 2026-07-24
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '002_add_inventory_vision_twin'
down_revision: Union[str, None] = '001_create_auth_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Suppliers ──────────────────────────────────────────────────
    op.create_table(
        'suppliers',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('code', sa.String(50), unique=True, index=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('contact_person', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(100), nullable=False),
        sa.Column('rating', sa.Float, nullable=False, server_default='5.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # ── Inventory Items ────────────────────────────────────────────
    op.create_table(
        'inventory_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('sku', sa.String(100), unique=True, index=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('category', sa.String(100), index=True, nullable=False),
        sa.Column('unit', sa.String(50), nullable=False),
        sa.Column('current_stock', sa.Float, nullable=False, server_default='0'),
        sa.Column('allocated_stock', sa.Float, nullable=False, server_default='0'),
        sa.Column('reorder_level', sa.Float, nullable=False, server_default='10'),
        sa.Column('target_stock', sa.Float, nullable=False, server_default='100'),
        sa.Column('unit_cost', sa.Float, nullable=False, server_default='0'),
        sa.Column('storage_location', sa.String(100), nullable=False),
        sa.Column('qr_code_data', sa.String(255), nullable=False),
        sa.Column('supplier_id', sa.String(36), sa.ForeignKey('suppliers.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # ── Stock Movements ────────────────────────────────────────────
    op.create_table(
        'stock_movements',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('item_id', sa.String(36), sa.ForeignKey('inventory_items.id', ondelete='CASCADE'), nullable=False),
        sa.Column('movement_type', sa.String(20), nullable=False),
        sa.Column('quantity', sa.Float, nullable=False),
        sa.Column('reference_no', sa.String(100), nullable=False),
        sa.Column('notes', sa.String(500), nullable=True),
        sa.Column('performed_by', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # ── Purchase Orders ────────────────────────────────────────────
    op.create_table(
        'purchase_orders',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('po_number', sa.String(100), unique=True, index=True, nullable=False),
        sa.Column('supplier_id', sa.String(36), sa.ForeignKey('suppliers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(30), nullable=False, server_default='ORDERED'),
        sa.Column('total_amount', sa.Float, nullable=False, server_default='0'),
        sa.Column('expected_delivery', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # ── Vision Jobs ────────────────────────────────────────────────
    op.create_table(
        'vision_jobs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('filename', sa.String(255), nullable=False),
        sa.Column('file_path', sa.String(512), nullable=False),
        sa.Column('file_size_bytes', sa.Integer, nullable=False),
        sa.Column('status', sa.String(20), nullable=False, server_default='PENDING'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
    )

    # ── Vision Predictions ─────────────────────────────────────────
    op.create_table(
        'vision_predictions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('job_id', sa.String(36), sa.ForeignKey('vision_jobs.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('model_name', sa.String(100), nullable=False),
        sa.Column('model_version', sa.String(50), nullable=False),
        sa.Column('confidence_score', sa.Float, nullable=False),
        sa.Column('estimated_progress', sa.Float, nullable=False),
        sa.Column('detected_classes', sa.JSON, nullable=False),
        sa.Column('raw_metadata', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # ── Digital Twin Models ────────────────────────────────────────
    op.create_table(
        'digital_twin_models',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('version', sa.String(50), nullable=False),
        sa.Column('elements_count', sa.Integer, nullable=False, server_default='0'),
        sa.Column('completed_progress', sa.Float, nullable=False, server_default='0'),
        sa.Column('file_url', sa.String(512), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # ── Spatial Annotations ────────────────────────────────────────
    op.create_table(
        'spatial_annotations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('model_id', sa.String(36), sa.ForeignKey('digital_twin_models.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.String(500), nullable=True),
        sa.Column('category', sa.String(30), nullable=False),
        sa.Column('position_x', sa.Float, nullable=False),
        sa.Column('position_y', sa.Float, nullable=False),
        sa.Column('position_z', sa.Float, nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='OPEN'),
        sa.Column('created_by', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('spatial_annotations')
    op.drop_table('digital_twin_models')
    op.drop_table('vision_predictions')
    op.drop_table('vision_jobs')
    op.drop_table('purchase_orders')
    op.drop_table('stock_movements')
    op.drop_table('inventory_items')
    op.drop_table('suppliers')
