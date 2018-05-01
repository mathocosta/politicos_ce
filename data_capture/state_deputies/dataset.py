# -*- coding: utf-8 -*-
"""Implementação da captação e salvamento dos dados dos politicos

Os dados são obtidos da Politicos API, os dados vem em formato JSON. É pego
somente os políticos eleitos no Ceará para o cargo de deputado estadual. A API
em alguns momentos pode não responder, por isso é feito um backup dos dados
para ser usado em caso de não funcionar a requisição. Os dados usados na
aplicação, são os do backup.
"""
import glob
import json
import os
from datetime import datetime

import requests

from data_capture.helpers import get_dataset, save_dataset


def fetch_dataset():
    """Obtém os dados brutos de todos os políticos do estado do ceará."""
    payload = {
        'limit': '50',
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

    if r.status_code == 200:
        json_data = json.loads(r.text)
        save_dataset(json_data['objects'], 'state-deputies')

    return get_dataset('state-deputies')
