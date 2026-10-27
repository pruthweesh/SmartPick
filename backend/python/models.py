"""
SmartPick SQLAlchemy Models - All 14 Database Tables (Section 4)
"""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, Index
)
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="user") # user, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    privacy_preferences_json = Column(Text, default="{}")

    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    wishlists = relationship("Wishlist", back_populates="user")
    price_alerts = relationship("PriceAlert", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    brand = Column(String, nullable=False, index=True)
    # Keep legacy string category for backward compatibility
    category = Column(String, nullable=False, index=True)
    # New foreign‑key to reusable Category table
    category_id = Column(String, ForeignKey("categories.id"), nullable=True, index=True)
    model_number = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    data_source = Column(String, nullable=False)
    last_checked_at = Column(DateTime, nullable=False)
    data_completeness_score = Column(Float, default=100.0)
    status = Column(String, default="approved", index=True) # approved, incomplete, disabled

    # Relationships
    category_rel = relationship("Category", back_populates="products", foreign_keys=[category_id])
    specifications = relationship("ProductSpecification", back_populates="product", cascade="all, delete-orphan")
    pros_cons = relationship("ProductProCon", back_populates="product", cascade="all, delete-orphan")
    offers = relationship("RetailerOffer", back_populates="product", cascade="all, delete-orphan")
    reviews_insights = relationship("ReviewsInsight", back_populates="product", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    parent_id = Column(String, ForeignKey("categories.id"), nullable=True, index=True)
    # Relationships
    children = relationship("Category", backref="parent", remote_side=[id])
    products = relationship("Product", back_populates="category_rel")

class ProductSpecification(Base):
    __tablename__ = "product_specifications"
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), index=True, nullable=False)
    spec_key = Column(String, index=True, nullable=False)
    spec_value = Column(String, nullable=False)
    unit = Column(String, nullable=True)
    source = Column(String, nullable=False)
    confidence = Column(String, default="verified") # verified, unverified, missing
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="specifications")

class ProductProCon(Base):
    __tablename__ = "product_pros_cons"
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), index=True, nullable=False)
    type = Column(String, nullable=False) # pro, con
    text = Column(Text, nullable=False)
    evidence_source = Column(String, nullable=False)
    confidence = Column(String, default="verified")
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="pros_cons")

class RetailerOffer(Base):
    __tablename__ = "retailer_offers"
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), index=True, nullable=False)
    retailer_name = Column(String, nullable=False, index=True)
    retailer_url = Column(String, nullable=False)
    current_price = Column(Float, nullable=False, index=True)
    original_price = Column(Float, nullable=False)
    discount_percentage = Column(Float, default=0.0)
    availability_status = Column(String, default="in_stock") # in_stock, out_of_stock, unknown
    affiliate_url = Column(String, nullable=True)
    is_affiliate = Column(Boolean, default=False)
    last_checked_at = Column(DateTime, default=datetime.utcnow)
    data_source = Column(String, nullable=False)

    product = relationship("Product", back_populates="offers")
    price_history = relationship("PriceHistory", back_populates="offer", cascade="all, delete-orphan")

class PriceHistory(Base):
    __tablename__ = "price_history"
    id = Column(String, primary_key=True, index=True)
    offer_id = Column(String, ForeignKey("retailer_offers.id"), index=True, nullable=False)
    price = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True)
    source = Column(String, nullable=False)
    notes = Column(String, nullable=True)

    offer = relationship("RetailerOffer", back_populates="price_history")

class ReviewsInsight(Base):
    __tablename__ = "reviews_insights"
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), index=True, nullable=False)
    positive_theme = Column(Text, nullable=False)
    negative_theme = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    evidence_source = Column(String, nullable=False)
    confidence = Column(String, default="high")
    generated_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="reviews_insights")

class UserPreference(Base):
    __tablename__ = "user_preferences"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    category = Column(String, default="earbuds")
    budget_min = Column(Float, default=0.0)
    budget_max = Column(Float, default=5000.0)
    intended_use = Column(String, default="calls")
    must_have_features_json = Column(Text, default="[]")
    deal_breakers_json = Column(Text, default="[]")
    preferred_brands_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="preferences")

class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    name = Column(String, default="My Saved Products")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlists")
    items = relationship("WishlistItem", back_populates="wishlist", cascade="all, delete-orphan")

class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    id = Column(String, primary_key=True, index=True)
    wishlist_id = Column(String, ForeignKey("wishlists.id"), index=True, nullable=False)
    product_id = Column(String, ForeignKey("products.id"), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    wishlist = relationship("Wishlist", back_populates="items")

class PriceAlert(Base):
    __tablename__ = "price_alerts"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    product_id = Column(String, ForeignKey("products.id"), index=True, nullable=False)
    target_price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="price_alerts")

class RecommendationSession(Base):
    __tablename__ = "recommendation_sessions"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=True)
    session_id = Column(String, unique=True, index=True, nullable=False)
    user_query = Column(Text, nullable=False)
    extracted_requirements_json = Column(Text, nullable=False)
    recommended_product_ids_json = Column(Text, nullable=False)
    ai_explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class IssueReport(Base):
    __tablename__ = "issue_reports"
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), index=True, nullable=True)
    offer_id = Column(String, ForeignKey("retailer_offers.id"), index=True, nullable=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=True)
    issue_type = Column(String, nullable=False) # wrong_price, broken_link, wrong_specification, misleading_recommendation, other
    description = Column(Text, nullable=False)
    status = Column(String, default="open", index=True) # open, investigating, resolved
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, index=True)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    metadata_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
