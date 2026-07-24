from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.models.inventory import InventoryItem, Supplier, StockMovement, PurchaseOrder, MovementType
from app.schemas.inventory import (
    InventoryItemCreate,
    InventoryItemResponse,
    SupplierCreate,
    SupplierResponse,
    StockMovementCreate,
    StockMovementResponse,
    PurchaseOrderCreate,
    PurchaseOrderResponse,
)

router = APIRouter(prefix="/inventory", tags=["Inventory Management"])

# --- INVENTORY ITEMS ---
@router.get("/items", response_model=List[InventoryItemResponse])
def get_inventory_items(
    category: Optional[str] = None,
    low_stock_only: bool = False,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(InventoryItem)

    if category:
        query = query.filter(InventoryItem.category == category)
    if low_stock_only:
        query = query.filter(InventoryItem.current_stock <= InventoryItem.reorder_level)
    if search:
        query = query.filter(
            (InventoryItem.name.ilike(f"%{search}%")) | (InventoryItem.sku.ilike(f"%{search}%"))
        )

    items = query.order_by(InventoryItem.name).all()
    results = []
    for item in items:
        resp = InventoryItemResponse.model_validate(item)
        if item.supplier:
            resp.supplier_name = item.supplier.name
        results.append(resp)
    return results

@router.post("/items", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    item_in: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(InventoryItem).filter(InventoryItem.sku == item_in.sku.upper()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item with this SKU already exists"
        )

    qr_data = f"SITEBRAIN:SKU:{item_in.sku.upper()}"
    new_item = InventoryItem(
        **item_in.model_dump(),
        sku=item_in.sku.upper(),
        qr_code_data=qr_data
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    resp = InventoryItemResponse.model_validate(new_item)
    if new_item.supplier:
        resp.supplier_name = new_item.supplier.name
    return resp

# --- STOCK MOVEMENTS ---
@router.post("/movements", response_model=StockMovementResponse, status_code=status.HTTP_201_CREATED)
def log_stock_movement(
    movement_in: StockMovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(InventoryItem).filter(InventoryItem.id == movement_in.item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")

    if movement_in.movement_type == MovementType.INCOMING:
        item.current_stock += movement_in.quantity
    elif movement_in.movement_type in [MovementType.OUTGOING, MovementType.RETURN]:
        if item.current_stock < movement_in.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock for movement")
        item.current_stock -= movement_in.quantity
    elif movement_in.movement_type == MovementType.ADJUSTMENT:
        item.current_stock = movement_in.quantity

    movement = StockMovement(
        **movement_in.model_dump(),
        performed_by=current_user.full_name
    )
    db.add(movement)
    db.commit()
    db.refresh(movement)

    resp = StockMovementResponse.model_validate(movement)
    resp.item_name = item.name
    resp.item_sku = item.sku
    return resp

# --- SUPPLIERS ---
@router.get("/suppliers", response_model=List[SupplierResponse])
def get_suppliers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Supplier).order_by(Supplier.name).all()

@router.post("/suppliers", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(
    supplier_in: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    supplier = Supplier(**supplier_in.model_dump(), code=supplier_in.code.upper())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

# --- PURCHASE ORDERS ---
@router.get("/purchase-orders", response_model=List[PurchaseOrderResponse])
def get_purchase_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pos = db.query(PurchaseOrder).order_by(PurchaseOrder.created_at.desc()).all()
    results = []
    for po in pos:
        resp = PurchaseOrderResponse.model_validate(po)
        if po.supplier:
            resp.supplier_name = po.supplier.name
        results.append(resp)
    return results

@router.post("/purchase-orders", response_model=PurchaseOrderResponse, status_code=status.HTTP_201_CREATED)
def create_purchase_order(
    po_in: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    po = PurchaseOrder(**po_in.model_dump())
    db.add(po)
    db.commit()
    db.refresh(po)

    resp = PurchaseOrderResponse.model_validate(po)
    if po.supplier:
        resp.supplier_name = po.supplier.name
    return resp
