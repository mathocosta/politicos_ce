# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos deputados estaduais

Nesse caso, os dados usados, são os mesmos do `/state_deputies/politician_data.py`,
portanto é usado o mesmo dataset.
"""
import requests

from data_capture.helpers import candidacy_parser
from data_capture.state_deputies.dataset import fetch_dataset


def get_candidacies_data():
    """Obtém os dados de candidaturas dos deputados"""
    dataset = fetch_dataset()

    return candidacy_parser(dataset)
