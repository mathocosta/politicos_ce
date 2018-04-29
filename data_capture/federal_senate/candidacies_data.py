# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos senadores"""
import requests
from politician_data import fetch_senators_data


def candidacy_filter(candidacy):
    return {
        'elected': candidacy['elected'],
        'date': candidacy['election_round']['date'],
        'election_round': candidacy['election_round']['round_number'],
        'institution': candidacy['institution']['name'],
        'position': candidacy['institution']['political_offices'][0]['name']
    }


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


def main():
    data = fetch_senators_data()
    print(data)
    for senator in data:
        print(fetch_candidacies_data(senator['civil_name']))


if __name__ == '__main__':
    main()
