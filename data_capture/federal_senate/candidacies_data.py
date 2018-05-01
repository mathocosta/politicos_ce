# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos senadores"""
import requests
from data_capture.helpers import candidacy_parser


def fetch_candidacies_data(name):
    """Obtém os dados de candidaturas por senador"""
    payload = {'name__in': name}
    r = requests.get(
        'http://politicos.olhoneles.org/api/v0/politicians/', params=payload)

    json_data = r.json()

    return candidacy_parser(json_data['objects'])
