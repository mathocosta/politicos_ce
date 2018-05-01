# -*- coding: utf-8 -*-
"""Algumas funções auxiliares"""


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
