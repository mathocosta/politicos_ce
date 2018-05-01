# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos deputados federais"""
import requests
from data_capture.helpers import candidacy_filter


def parse_data(data):
    """Processa os dados brutos das candidaturas por político"""
    result = list()
    for d in data:
        result.append({
            'politician_name': d['name'],
            'candidacies': list(map(candidacy_filter, d['candidacies']))
        })

    return result


def fetch_candidacies_data():
    """Obtém os dados da API"""
    payload = {
        'limit': '30',
        'candidacies__elected__in': '1',
        'candidacies__election_round__election__year__in': '2014',
        'candidacies__political_office__slug__in': 'deputado-federal',
        'candidacies__state__slug__in': 'ceara'
    }
    r = requests.get(
        'http://politicos.olhoneles.org/api/v0/politicians/', params=payload)

    json_data = r.json()

    return parse_data(json_data['objects'])
