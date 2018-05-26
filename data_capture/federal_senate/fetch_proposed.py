"""Implementação da captação das propostas de um senador

Os dados são obtidos da API do Senado, e filtrados para obter os
dados desejados dos senadores cearenses.
"""

import pandas as pd
import requests
from bs4 import BeautifulSoup

from data_capture.federal_senate.helpers import (get_proposition_url,
                                                 make_excerpt)


def get_props_by_type(id, prop_type, year):
    """Pega as proposições de um senador por tipo.

    A API de dados abertos do senado, ao contrário da câmara, não
    permite a passagem de mais parâmetros de um tipo de uma vez
    na requisição das propostas. Portanto foi criada essa função.


    Args:
        id (int): Identificador do Senador
        prop_type (str): Sigla do tipo da proposição
        year (int): Ano da proposição

    Returns:
        list: Proposições desse tipo.
    """
    print("Obtendo os dados do senador para {}".format(prop_type))

    payload = {'sigla': prop_type, 'ano': year}

    r = requests.get(
        "http://legis.senado.gov.br/dadosabertos/senador/{0}/autorias".format(
            id), params=payload)

    soup = BeautifulSoup(r.content, 'xml')

    propositions = soup.find_all('Autoria')

    number_of_propositions = len(propositions) - 1

    result = list()

    for i in range(0, number_of_propositions):
        url = get_proposition_url(propositions[i].CodigoMateria.text,
                                  propositions[i].DescricaoSubtipoMateria.text)
        description = make_excerpt(propositions[i].EmentaMateria.text)

        result.append({
            'id': propositions[i].CodigoMateria.text,
            'siglum': propositions[i].SiglaSubtipoMateria.text,
            'number': propositions[i].NumeroMateria.text,
            'description': description,
            'year': propositions[i].AnoMateria.text,
            'status': propositions[i].IndicadorTramitando.text,
            'url': url
        })

    return result


def get_data_from_senator(id, year):
    result = list()
    result.extend(get_props_by_type(id, 'pls', year))
    result.extend(get_props_by_type(id, 'pec', year))

    columns = ['id', 'siglum', 'number',
               'description', 'year', 'status', 'url']
    df = pd.DataFrame(result, columns=columns)

    return df


def main():
    print(get_data_from_senator(3396))


if __name__ == '__main__':
    main()
