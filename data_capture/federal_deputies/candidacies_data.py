# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos deputados federais"""
import requests
from data_capture.helpers import candidacy_parser


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

    return candidacy_parser(json_data['objects'])
