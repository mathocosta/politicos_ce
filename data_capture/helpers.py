# -*- coding: utf-8 -*-
"""Algumas funções auxiliares"""
import glob
import json
import os
from datetime import datetime


def candidacy_filter(candidacy):
    """Filtra os dados das candidaturas."""
    return {
        'elected': candidacy['elected'],
        'date': candidacy['election_round']['date'],
        'election_round': candidacy['election_round']['round_number'],
        'institution': candidacy['institution']['name'],
        'position': candidacy['institution']['political_offices'][0]['name']
    }


def candidacy_parser(data):
    """Processa os dados brutos das candidaturas por político

    Basicamente pega os dados brutos do político, processa e retorna
    os somente o nome, e o histórico de candidaturas.

    Args:
        data (dict)

    Returns:
        dict: Dicionário com os dados filtrados.
    """
    result = list()
    for d in data:
        result.append({
            'politician_name': d['name'],
            'candidacies': list(map(candidacy_filter, d['candidacies']))
        })

    return result


def save_dataset(data, name):
    """Salva os dados em um arquivo de backup"""
    today = datetime.strftime(datetime.now(), '%Y-%m-%d')
    backup_dir = os.path.join(os.getcwd(), './backups')
    file_path = os.path.join(
        os.getcwd(), backup_dir, '{0}-{1}.json'.format(name, today))

    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)

    with open(file_path, 'w', encoding='utf8') as file:
        file.write(json.dumps(data, ensure_ascii=False))


def get_dataset(name):
    """Pega os dados do arquivo de backup"""
    backup_dir = os.path.join(os.getcwd(), 'backups')
    all_backup_files = glob.glob('{0}/{1}*'.format(backup_dir, name))
    last_backup = max(all_backup_files, key=os.path.getctime)

    with open(os.path.join(backup_dir, last_backup), encoding='utf8') as file:
        json_data = json.load(file)

        return json_data

def fix_name(name):
    """Ajeita os nomes dos políticos

    Na API das candidaturas, por algum motivo, os nomes estão sem o acento
    agudo. Essa função retira ele dos nomes, para que funcione a captação.

    Args:
        name (str): Nome original

    Returns:
        str: Nome sem acento agudo
    """
    accents = [('á', 'a'), ('é', 'e'), ('í', 'i'), ('ó', 'o'), ('ú', 'u')]

    for e in accents:
        name = name.replace(e[0], e[1])

    return name