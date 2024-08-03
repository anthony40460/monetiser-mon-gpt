from app import db
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property

class BaseModel(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = db.Column(db.Boolean, default=False)

    @hybrid_property
    def is_active(self):
        return not self.is_deleted

class User(BaseModel):
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128))
    gpts = db.relationship('GPT', backref='owner', lazy='dynamic')
    profile = db.relationship('UserProfile', uselist=False, back_populates='user')

class UserProfile(BaseModel):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    full_name = db.Column(db.String(100))
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(255))
    user = db.relationship('User', back_populates='profile')

class GPT(BaseModel):
    name = db.Column(db.String(100), nullable=False, index=True)
    description = db.Column(db.Text)
    api_key = db.Column(db.String(100), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    version = db.Column(db.String(20), nullable=False, default='1.0.0')
    model_type = db.Column(db.String(50))
    training_data = db.Column(db.Text)
    paywalls = db.relationship('Paywall', backref='gpt', lazy='dynamic')

class Paywall(BaseModel):
    name = db.Column(db.String(100), nullable=False, index=True)
    price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='USD')
    gpt_id = db.Column(db.Integer, db.ForeignKey('gpt.id'), nullable=False)
    subscriptions = db.relationship('Subscription', backref='paywall', lazy='dynamic')

class Subscription(BaseModel):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    paywall_id = db.Column(db.Integer, db.ForeignKey('paywall.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), nullable=False, default='active')

class Transaction(BaseModel):
    paywall_id = db.Column(db.Integer, db.ForeignKey('paywall.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='USD')
    status = db.Column(db.String(20), nullable=False, index=True)
    payment_method = db.Column(db.String(50))
    payment_gateway = db.Column(db.String(50))
    transaction_id = db.Column(db.String(100), unique=True)

    paywall = db.relationship('Paywall', backref='transactions')
    user = db.relationship('User', backref='transactions')

class WebhookEvent(BaseModel):
    event_type = db.Column(db.String(50), nullable=False, index=True)
    payload = db.Column(db.JSON)
    status = db.Column(db.String(20), nullable=False, default='pending')
    attempts = db.Column(db.Integer, default=0)
    last_attempt = db.Column(db.DateTime)
    response = db.Column(db.Text)