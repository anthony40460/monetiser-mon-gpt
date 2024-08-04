import os
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
api = Api(app)

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://yourfrontenddomain.com"]}})

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///authflow.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

limiter = Limiter(app, key_func=get_remote_address)

class HelloResource(Resource):
    @limiter.limit("5 per minute")
    def get(self):
        app.logger.info(f"Hello endpoint accessed from IP: {request.remote_addr}")
        return {"message": "Welcome to AuthFlow API"}

api.add_resource(HelloResource, '/')

if __name__ == '__main__':
    app.run(debug=os.getenv('DEBUG', 'False') == 'True')