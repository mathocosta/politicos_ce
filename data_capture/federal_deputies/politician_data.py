# -*- coding: utf-8 -*-
"""Implementação da captação dos dados dos deputados federais

Os dados são obtidos da API da Câmara dos Deputados, e filtrados para obter os
dados desejados dos deputados cearenses.
"""
import requests
from bs4 import BeautifulSoup


def get_deputies_from_ce(data):
    for d in data:
        if d.uf.text == 'CE':
            yield d


def get_data_from_deputie(id):
    head_options = {'accept': 'application/xml'}
    r = requests.get(
        "https://dadosabertos.camara.leg.br/api/v2/deputados/{0}".format(id),
        headers=head_options)

    soup = BeautifulSoup(r.content, 'xml')
    dados = soup.dados

    return {
        'registered_id': dados.id.text,
        'civil_name': dados.nomeCivil.text,
        'parliamentary_name': dados.ultimoStatus.nomeEleitoral.text,
        'party': dados.ultimoStatus.siglaPartido.text,
        'hometown': dados.municipioNascimento.text,
        'scholarity': dados.escolaridade.text
    }


def parse_deputies(data):
    result = list()

    for d in get_deputies_from_ce(data):
        print("Obtendo os dados do dep. {0} ({1}) ...".format(
            d.nomeParlamentar.text, d.ideCadastro.text))
        result.append(get_data_from_deputie(d.ideCadastro.text))

    return result


def fetch_deputies_data():
    print("Obtendo os dados dos deputados...")
    r = requests.get(
        'http://www.camara.leg.br/SitCamaraWS/deputados.asmx/ObterDeputados')

    soup = BeautifulSoup(r.content, 'xml')
    deputies_data = parse_deputies(soup.find_all('deputado'))

    return deputies_data


def main():
    data = fetch_deputies_data()


if __name__ == '__main__':
    main()
