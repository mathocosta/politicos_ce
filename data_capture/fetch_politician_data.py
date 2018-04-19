# -*- coding: utf-8 -*-
"""Implementação da captação dos dados dos politicos

Os dados são obtidos da Politicos API e salvos no banco de dados.
Esse script roda toda vez que o sistema começa a funcionar. É pego somente os
políticos eleitos no Ceará para o cargo de deputado estadutal.
"""
import requests

from app import db
from app.models import Politician, Candidacy

payload = {
    'limit': '10',
    'candidacies__elected': 'true',
    'candidacies__state__slug': 'ceara',
    'candidacies__political_office__slug': 'deputado-estadual',
    'candidacies__election_round__election__year': '2014',
    'state__siglum': 'CE'
}
r = requests.get(
    'http://politicos.olhoneles.org:80/api/v0/politicians/',
    params=payload
)
json_data = r.json()

for c in json_data['objects']:
    p = Politician(c['name'].upper(), "", "", 0)
    db.session.add(p)

db.session.commit()
