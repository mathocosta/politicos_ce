# -*- coding: utf-8 -*-
"""Implementação da captação dos dados dos Senadores

Os dados são obtidos da API do Senado, e filtrados para obter os
dados desejados dos senadores cearenses.
"""
from datetime import datetime

import requests
from bs4 import BeautifulSoup


def get_data_from_senator(id):
    r = requests.get(
        "http://legis.senado.leg.br/dadosabertos/senador/{0}".format(id))

    soup = BeautifulSoup(r.content, 'xml')

    dados = soup.Parlamentar

    birth_date = datetime.strptime(
        dados.DadosBasicosParlamentar.DataNascimento.text, '%Y-%m-%d')

    # Os dados da API não contam com cidade de nascimento, nem escolaridade.
    return {
        'registered_id': dados.IdentificacaoParlamentar.CodigoParlamentar.text,
        'civil_name': dados.IdentificacaoParlamentar.NomeCompletoParlamentar.text,
        'parliamentary_name': dados.IdentificacaoParlamentar.NomeParlamentar.text,
        'party': dados.IdentificacaoParlamentar.SiglaPartidoParlamentar.text,
        'birth': datetime.strftime(birth_date, '%d/%m/%y'),
        'hometown': '',
        'scholarity': '',
        'position': 'senator',
        'url_photo': dados.IdentificacaoParlamentar.UrlFotoParlamentar.text
    }


def parse_senators(data):
    result = list()

    for s in data:
        result.append(get_data_from_senator(
            s.IdentificacaoParlamentar.CodigoParlamentar.text))

    return result


def fetch_senators_data():
    print('Obtendo os dados dos senadores...')
    payload = {'uf': 'ce'}
    r = requests.get(
        "http://legis.senado.leg.br/dadosabertos/senador/lista/atual",
        params=payload)

    soup = BeautifulSoup(r.content, 'xml')
    senators_data = parse_senators(soup.find_all('Parlamentar'))

    return senators_data


def main():
    print(fetch_senators_data())


if __name__ == '__main__':
    main()
