# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos deputados estaduais

Nesse caso, os dados usados, são os mesmos do `/state_deputies/politician_data.py`,
portanto é usado o mesmo dataset.
"""
import requests
from dataset import fetch_dataset


def candidacy_filter(candidacy):
    return {
        'elected': candidacy['elected'],
        'date': candidacy['election_round']['date'],
        'election_round': candidacy['election_round']['round_number'],
        'institution': candidacy['institution']['name'],
        'position': candidacy['institution']['political_offices'][0]['name']
    }


def parse_data(data):
    """Processa os dados brutos das candidaturas por político e retorna uma lista
    com os dados processados."""
    result = list()
    for d in data:
        result.append({
            'politician_name': d['name'],
            'candidacies': list(map(candidacy_filter, d['candidacies']))
        })

    return result


def get_candidacies_data(dataset):
    """Obtém os dados de candidaturas dos deputados"""

    return parse_data(dataset)


def main():
    dataset = fetch_dataset()
    data = get_candidacies_data(dataset)
    for d in data:
        print(d)


if __name__ == '__main__':
    main()
