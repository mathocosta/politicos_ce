# -*- coding: utf-8 -*-
"""Captação do histórico de candidaturas dos deputados estaduais

Nesse caso, os dados usados, são os mesmos do `/state_deputies/politician_data.py`,
portanto é usado o mesmo dataset.
"""
import requests
from data_capture.state_deputies.dataset import fetch_dataset
from data_capture.helpers import candidacy_parser


def get_candidacies_data(dataset):
    """Obtém os dados de candidaturas dos deputados"""

    return candidacy_parser(dataset)
