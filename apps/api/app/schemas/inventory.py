from pydantic import BaseModel, Field
from datetime import datetime
from app.models.inventory import MovementType, POStatus

class SupplierBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=50)
    name: str = Field(..., min_length=2, max_length=255)
    contact_person: str
    email: str
    phone: str
    rating: float = 5.0

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class InventoryItemBase(BaseModel):
    sku: str = Field(..., min_length=2, max_length=100)
    name: str = Field(..., min_length=2, max_length=255)
    category: str
    unit: str
    current_stock: float = 0.0
    allocated_stock: float = 0.0
    reorder_level: float = 10.0
    target_stock: float = 100.0
    unit_cost: float = 0.0
    storage_location: str
    supplier_id: str | None = None

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemResponse(InventoryItemBase):
    id: str
    qr_code_data: str
    supplier_name: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StockMovementCreate(BaseModel):
    item_id: str
    movement_type: MovementType
    quantity: float = Field(..., gt=0)
    reference_no: str
    notes: str | None = None
    performed_by: str | None = None

class StockMovementResponse(BaseModel):
    id: str
    item_id: str
    item_name: str | None = None
    item_sku: str | None = None
    movement_type: MovementType
    quantity: float
    reference_no: str
    notes: str | None = None
    performed_by: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class PurchaseOrderCreate(BaseModel):
    po_number: str
    supplier_id: str
    total_amount: float
    expected_delivery: datetime
    status: POStatus = POStatus.ORDERED

class PurchaseOrderResponse(BaseModel):
    id: str
    po_number: str
    supplier_id: str
    supplier_name: str | None = None
    status: POStatus
    total_amount: float
    expected_delivery: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
