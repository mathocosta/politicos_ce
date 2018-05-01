# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos senadores"""
import requests

from data_capture.helpers import candidacy_parser, get_dataset, save_dataset


def fetch_candidacies_data(name):
    """Obtém os dados de candidaturas por senador"""
    payload = {'name__in': name}
    r = requests.get(
        'http://politicos.olhoneles.org/api/v0/politicians/', params=payload)

    json_data = r.json()

    if r.status_code == 200:
        save_dataset(json_data['objects'], 'senators')

    return candidacy_parser(get_dataset('senators'))
