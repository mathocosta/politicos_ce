import sys
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_whooshee import Whooshee
from flask_migrate import Migrate
from decouple import config

# Adicionando o modulo externo ao path
sys.path.append(os.path.join(os.getcwd(), 'data_capture'))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_ECHO'] = config('SQLALCHEMY_ECHO', cast=bool)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['WHOOSHEE_DIR'] = 'whoosh'
app.debug = True

db = SQLAlchemy(app)
migrate = Migrate(app, db)
whooshee = Whooshee(app)

from . import views
from .models import Politician

