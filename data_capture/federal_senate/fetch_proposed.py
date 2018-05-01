"""Implementação da captação das propostas de um senador

Os dados são obtidos da API do Senado, e filtrados para obter os
dados desejados dos senadores cearenses.
"""

import requests
from bs4 import BeautifulSoup


def get_data_from_senator(id):

    print('Obtendo os dados do senador...')

    r = requests.get(
        "http://legis.senado.gov.br/dadosabertos/senador/{0}/autorias".format(id))

    soup = BeautifulSoup(r.content, 'xml')

    propositions = soup.find_all('Autoria')

    number_of_propositions = len(propositions) - 1

    print(number_of_propositions)

    result = {}

    for i in range(0, number_of_propositions):
        result[i] = {
            'proposition_code': propositions[i].CodigoMateria.text,
            'type': propositions[i].SiglaSubtipoMateria.text,
            'proposition_number': propositions[i].NumeroMateria.text,
            'year': propositions[i].AnoMateria.text,
            'ongoing': propositions[i].IndicadorTramitando.text,
            'original_author': propositions[i].IndicadorAutorPrincipal.text,
            'description': propositions[i].EmentaMateria.text
        }

    return result


def main():
    print(get_data_from_senator(3396))


if __name__ == '__main__':
    main()
