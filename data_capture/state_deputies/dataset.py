# -*- coding: utf-8 -*-
"""Implementação da captação e salvamento dos dados dos politicos

Os dados são obtidos da Politicos API, os dados vem em formato JSON. É pego
somente os políticos eleitos no Ceará para o cargo de deputado estadual. A API
em alguns momentos pode não responder, por isso é feito um backup dos dados
para ser usado em caso de não funcionar a requisição. Os dados usados na
aplicação, são os do backup.
"""
import os
import glob
import json
import requests
from datetime import datetime


def get_dataset():
    """Pega os dados do arquivo de backup"""
    backup_dir = os.path.join(os.getcwd(), 'backups')
    all_backup_files = glob.glob('{0}/*'.format(backup_dir))
    last_backup = max(all_backup_files, key=os.path.getctime)

    with open(os.path.join(backup_dir, last_backup), encoding='utf8') as file:
        json_data = json.load(file)

        return json_data


def save_dataset(data):
    """Salva os dados em um arquivo de backup"""
    today = datetime.strftime(datetime.now(), '%Y-%m-%d')
    backup_dir = os.path.join(os.getcwd(), './backups')
    file_path = os.path.join(
        os.getcwd(), backup_dir, 'politicos-dataset-{}.json'.format(today))

    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)

    with open(file_path, 'w', encoding='utf8') as file:
        file.write(json.dumps(data, ensure_ascii=False))


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
        save_dataset(json_data['objects'])

    return get_dataset()
