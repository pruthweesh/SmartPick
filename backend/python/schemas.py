"""
SmartPick Pydantic Validation Schemas
"""
from datetime import datetime

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, EmailStr


class UserRegister(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(min_length=6)
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class ProductSpecSchema(BaseModel):
    id: str
    spec_key: str
    spec_value: str
    unit: Optional[str] = None
    source: str
    confidence: str

class ProductProConSchema(BaseModel):
    id: str
    type: str
    text: str
    evidence_source: str
    confidence: str

class RetailerOfferSchema(BaseModel):
    id: str
    retailer_name: str
    retailer_url: str
    current_price: float
    original_price: float
    discount_percentage: float
    availability_status: str
    affiliate_url: Optional[str] = None
    is_affiliate: bool
    last_checked_at: Any

class ProductDetailSchema(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    model_number: Optional[str] = None
    description: str
    image_url: Optional[str] = None
    data_completeness_score: float
    status: str
    category_id: Optional[str] = None
    pros_cons: List[ProductProConSchema] = []
    offers: List[RetailerOfferSchema] = []

class RecommendationRequest(BaseModel):
    query: Optional[str] = None
    requirements: Optional[Dict[str, Any]] = None
    budget_min: Optional[float] = 0.0
    budget_max: Optional[float] = None
    category: Optional[str] = None
    intended_use: Optional[List[str]] = []
    must_have_features: Optional[List[str]] = []
    deal_breakers: Optional[List[str]] = []
    preferred_brands: Optional[List[str]] = []
    usage_priority: Optional[str] = "value"

class ClarifyRequest(BaseModel):
    current_requirements: Dict[str, Any]
    answers: Dict[str, str]

class CompareRequest(BaseModel):
    product_ids: List[str] = Field(min_length=2, max_length=4)

class IssueCreate(BaseModel):
    product_id: Optional[str] = None
    offer_id: Optional[str] = None
    issue_type: str
    description: str

class PriceAlertCreate(BaseModel):
    product_id: str
    target_price: float

# Cart Schemas
class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    added_at: datetime

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    id: str
    user_id: str
    items: List[CartItemResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: str
    product_name: str
    product_image: Optional[str] = None
    unit_price: float
    quantity: int = 1

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    # Shipping address fields (demo)
    ship_name: str
    ship_phone: str
    ship_address: str
    ship_city: str
    ship_state: str
    ship_postal_code: str
    ship_country: str
    ship_instructions: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    product_image: Optional[str]
    unit_price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class UserPreferenceBase(BaseModel):
    category: str = "earbuds"
    budget_min: float = 0.0
    budget_max: float = 5000.0
    intended_use: str = "calls"
    must_have_features: List[str] = []
    deal_breakers: List[str] = []
    preferred_brands: List[str] = []

class UserPreferenceResponse(UserPreferenceBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
