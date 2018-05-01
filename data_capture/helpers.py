# -*- coding: utf-8 -*-
"""Algumas funções auxiliares"""


def candidacy_filter(candidacy):
    """Filtra os dados das candidaturas.

    Basicamente pega os dados brutos de uma candidatura, processa e retorna
    os dados desejados.

    Args:
        candidacy (dict)

    Returns:
        dict: Dicionário com os dados filtrados.
    """
    return {
        'elected': candidacy['elected'],
        'date': candidacy['election_round']['date'],
        'election_round': candidacy['election_round']['round_number'],
        'institution': candidacy['institution']['name'],
        'position': candidacy['institution']['political_offices'][0]['name']
    }
