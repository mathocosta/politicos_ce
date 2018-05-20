"""Implementação da captação das propostas de um senador

Os dados são obtidos da API do Senado, e filtrados para obter os
dados desejados dos senadores cearenses.
"""

import pandas as pd
import requests
from bs4 import BeautifulSoup

from data_capture.federal_senate.helpers import (get_proposition_url,
                                                 make_excerpt)


def get_props_by_type(id, prop_type):
    """Pega as proposições de um senador por tipo.

    A API de dados abertos do senado, ao contrário da câmara, não
    permite a passagem de mais parâmetros de um tipo de uma vez
    na requisição das propostas. Portanto foi criada essa função.


    Args:
        id (int): Identificador do Senador
        prop_type (str): Sigla do tipo da proposição

    Returns:
        list: Proposições desse tipo.
    """
    print("Obtendo os dados do senador para {}".format(prop_type))

    payload = {'sigla': prop_type, 'ano': 2018}

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
            'proposition_code': propositions[i].CodigoMateria.text,
            'siglum': propositions[i].SiglaSubtipoMateria.text,
            'number': propositions[i].NumeroMateria.text,
            'year': propositions[i].AnoMateria.text,
            'status': propositions[i].IndicadorTramitando.text,
            'original_author': propositions[i].IndicadorAutorPrincipal.text,
            'description': description,
            'url': url
        })

    return result


def get_data_from_senator(id):
    result = list()
    result.extend(get_props_by_type(id, 'pls'))
    result.extend(get_props_by_type(id, 'pec'))

    df = pd.DataFrame(result)

    return df


def main():
    print(get_data_from_senator(3396))


if __name__ == '__main__':
    main()
