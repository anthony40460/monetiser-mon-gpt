from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, GPT, Paywall, Transaction
import jwt
from functools import wraps
import os
from datetime import datetime, timedelta
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, validate
import logging

api = Blueprint('api', __name__)
limiter = Limiter(key_func=get_remote_address)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=["HS256"])
            if datetime.fromtimestamp(data['exp']) < datetime.utcnow():
                return jsonify({'message': 'Token has expired!', 'refresh': True}), 401
            current_user = User.query.filter_by(id=data['user_id']).first()
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!', 'refresh': True}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def generate_tokens(user_id):
    access_token = jwt.encode({
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(minutes=15)
    }, os.environ.get('SECRET_KEY'))
    refresh_token = jwt.encode({
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, os.environ.get('SECRET_KEY'))
    return access_token, refresh_token

class UserSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

class GPTSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(required=True)

class PaywallSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    gpt_id = fields.Int(required=True)

class TransactionSchema(Schema):
    paywall_id = fields.Int(required=True)

@api.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    schema = UserSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400
    
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists!'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists!'}), 400
    
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    # Send verification email (implement this function)
    send_verification_email(new_user.email)
    
    logger.info(f"New user registered: {new_user.username}")
    return jsonify({'message': 'New user created! Please check your email to verify your account.'}), 201

@api.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    schema = LoginSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400
    
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        logger.warning(f"Login attempt with non-existent username: {data['username']}")
        return jsonify({'message': 'User not found!'}), 404
    if check_password_hash(user.password_hash, data['password']):
        if not user.is_verified:
            return jsonify({'message': 'Please verify your email before logging in.'}), 401
        access_token, refresh_token = generate_tokens(user.id)
        logger.info(f"User logged in: {user.username}")
        return jsonify({'access_token': access_token, 'refresh_token': refresh_token})
    logger.warning(f"Failed login attempt for user: {user.username}")
    return jsonify({'message': 'Invalid credentials!'}), 401

@api.route('/refresh', methods=['POST'])
def refresh():
    refresh_token = request.headers.get('Refresh-Token')
    if not refresh_token:
        return jsonify({'message': 'Refresh token is missing!'}), 401
    try:
        data = jwt.decode(refresh_token, os.environ.get('SECRET_KEY'), algorithms=["HS256"])
        new_access_token, new_refresh_token = generate_tokens(data['user_id'])
        return jsonify({'access_token': new_access_token, 'refresh_token': new_refresh_token})
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Refresh token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid refresh token!'}), 401

@api.route('/verify_email/<token>', methods=['GET'])
def verify_email(token):
    try:
        email = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=["HS256"])['email']
        user = User.query.filter_by(email=email).first()
        if user:
            user.is_verified = True
            db.session.commit()
            logger.info(f"Email verified for user: {user.username}")
            return jsonify({'message': 'Email verified successfully!'}), 200
        else:
            return jsonify({'message': 'Invalid verification link!'}), 400
    except:
        return jsonify({'message': 'Invalid verification link!'}), 400

@api.route('/gpt', methods=['POST'])
@token_required
def create_gpt(current_user):
    schema = GPTSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400
    
    data = request.get_json()
    new_gpt = GPT(name=data['name'], description=data['description'], user_id=current_user.id)
    db.session.add(new_gpt)
    db.session.commit()
    logger.info(f"New GPT created by user: {current_user.username}")
    return jsonify({'message': 'New GPT created!'}), 201

@api.route('/gpt', methods=['GET'])
@token_required
def get_all_gpts(current_user):
    gpts = GPT.query.filter_by(user_id=current_user.id).all()
    output = []
    for gpt in gpts:
        gpt_data = {}
        gpt_data['id'] = gpt.id
        gpt_data['name'] = gpt.name
        gpt_data['description'] = gpt.description
        output.append(gpt_data)
    logger.info(f"GPTs retrieved for user: {current_user.username}")
    return jsonify({'gpts': output})

@api.route('/paywall', methods=['POST'])
@token_required
def create_paywall(current_user):
    schema = PaywallSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400
    
    data = request.get_json()
    gpt = GPT.query.filter_by(id=data['gpt_id'], user_id=current_user.id).first()
    if not gpt:
        return jsonify({'message': 'GPT not found or you do not have permission!'}), 404
    new_paywall = Paywall(name=data['name'], price=data['price'], gpt_id=gpt.id)
    db.session.add(new_paywall)
    db.session.commit()
    logger.info(f"New paywall created for GPT: {gpt.name} by user: {current_user.username}")
    return jsonify({'message': 'New paywall created!'}), 201

@api.route('/transaction', methods=['POST'])
@token_required
def create_transaction(current_user):
    schema = TransactionSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400
    
    data = request.get_json()
    paywall = Paywall.query.filter_by(id=data['paywall_id']).first()
    if not paywall:
        return jsonify({'message': 'Paywall not found!'}), 404
    new_transaction = Transaction(paywall_id=paywall.id, amount=paywall.price, status='completed')
    db.session.add(new_transaction)
    db.session.commit()
    logger.info(f"New transaction created for paywall: {paywall.name} by user: {current_user.username}")
    return jsonify({'message': 'Transaction completed!'}), 201