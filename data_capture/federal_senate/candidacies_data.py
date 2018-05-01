# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos senadores"""
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


def fetch_candidacies_data(name):
    """Obtém os dados de candidaturas por senador"""
    payload = {'name__in': name}
    r = requests.get(
        'http://politicos.olhoneles.org/api/v0/politicians/', params=payload)

    json_data = r.json()

    return parse_data(json_data['objects'])
