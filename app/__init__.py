from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from decouple import config


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_ECHO'] = config('SQLALCHEMY_ECHO')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from . import views, models
