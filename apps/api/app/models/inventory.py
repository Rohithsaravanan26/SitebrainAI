import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Boolean, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class MovementType(str, enum.Enum):
    INCOMING = "INCOMING"
    OUTGOING = "OUTGOING"
    ADJUSTMENT = "ADJUSTMENT"
    RETURN = "RETURN"

class POStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ORDERED = "ORDERED"
    PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_person: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(100), nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    items: Mapped[list["InventoryItem"]] = relationship("InventoryItem", back_populates="supplier")
    purchase_orders: Mapped[list["PurchaseOrder"]] = relationship("PurchaseOrder", back_populates="supplier")

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False)
    current_stock: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    allocated_stock: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    reorder_level: Mapped[float] = mapped_column(Float, default=10.0, nullable=False)
    target_stock: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    unit_cost: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    storage_location: Mapped[str] = mapped_column(String(100), nullable=False)
    qr_code_data: Mapped[str] = mapped_column(String(255), nullable=False)
    supplier_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    supplier: Mapped["Supplier | None"] = relationship("Supplier", back_populates="items")
    movements: Mapped[list["StockMovement"]] = relationship("StockMovement", back_populates="item", cascade="all, delete-orphan")

class StockMovement(Base):
    __tablename__ = "stock_movements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id: Mapped[str] = mapped_column(String(36), ForeignKey("inventory_items.id", ondelete="CASCADE"), nullable=False)
    movement_type: Mapped[MovementType] = mapped_column(SQLEnum(MovementType), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    reference_no: Mapped[str] = mapped_column(String(100), nullable=False)
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)
    performed_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    item: Mapped["InventoryItem"] = relationship("InventoryItem", back_populates="movements")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    po_number: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    supplier_id: Mapped[str] = mapped_column(String(36), ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[POStatus] = mapped_column(SQLEnum(POStatus), default=POStatus.ORDERED, nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    expected_delivery: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    supplier: Mapped["Supplier"] = relationship("Supplier", back_populates="purchase_orders")
