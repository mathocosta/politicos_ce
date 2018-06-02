import sys
import os

from decouple import config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_whooshee import Whooshee
from flask_migrate import Migrate
from werkzeug.contrib.cache import SimpleCache

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
cache = SimpleCache()
CACHE_TIMEOUT = 86400


def update_cache_value(key, df):
    """Atualiza o valor da key no cache

    Args:
        key (str)
        df (pd.DataFrame): Dados para salvar
    """
    saved = df.to_dict('records')
    cache.set(key, saved, timeout=CACHE_TIMEOUT)


from . import views
from .models import Politician
from .politician_page import page
app.register_blueprint(page)
