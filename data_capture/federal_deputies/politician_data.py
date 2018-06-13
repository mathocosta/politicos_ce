# -*- coding: utf-8 -*-
"""Implementação da captação dos dados dos deputados federais

Os dados são obtidos da API da Câmara dos Deputados, e filtrados para obter os
dados desejados dos deputados cearenses.
"""
from datetime import datetime
from dateutil.parser import parse
import requests
from bs4 import BeautifulSoup

HEAD_OPTIONS = {'accept': 'application/xml'}


def get_data_from_deputie(id):
    r = requests.get(
        "https://dadosabertos.camara.leg.br/api/v2/deputados/{0}".format(id),
        headers=HEAD_OPTIONS)

    soup = BeautifulSoup(r.content, 'xml')
    dados = soup.dados

    birth_date = datetime.strptime(dados.dataNascimento.text, '%Y-%m-%d')

    return {
        'registered_id': dados.id.text,
        'civil_name': dados.nomeCivil.text.title(),
        'parliamentary_name': dados.ultimoStatus.nomeEleitoral.text.title(),
        'party': dados.ultimoStatus.siglaPartido.text,
        'birth': datetime.strftime(birth_date, '%d/%m/%y'),
        'hometown': dados.municipioNascimento.text,
        'scholarity': dados.escolaridade.text,
        'position': 'federal-deputy',
        'url_photo': dados.urlFoto.text
    }


def parse_deputies(data):
    result = list()

    for d in data:
        print("Obtendo os dados do dep. {0} ({1}) ...".format(
            d.nome.text, d.id.text))
        result.append(get_data_from_deputie(d.id.text))

    return result


def fetch_deputies_data():
    print("Obtendo os dados dos deputados...")
    payload = {
        'siglaUf': 'ce',
        'itens': '30',
        'ordenarPor': 'nome'
    }
    r = requests.get(
        'https://dadosabertos.camara.leg.br/api/v2/deputados',
        params=payload,
        headers=HEAD_OPTIONS)

    soup = BeautifulSoup(r.content, 'xml')
    deputies_data = parse_deputies(soup.find_all('deputado_'))

    return deputies_data


def main():
    print(fetch_deputies_data())


if __name__ == '__main__':
    main()
