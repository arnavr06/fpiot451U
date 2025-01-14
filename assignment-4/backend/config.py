from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# This file is used to initialise Flask, the database and to initialise Cross-Origin Resource Sharing (CORS) for the app

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)