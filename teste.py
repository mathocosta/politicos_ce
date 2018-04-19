from flask_sqlalchemy import SQLAlchemy
from decouple import config
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config('DATABASE_URI')
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)

print(db.engine.dialect.has_table(db.engine, "users"))
