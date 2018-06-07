"""Implementação da captação das propostas de um deputado federal

Os dados são obtidos da API completa da Câmara dos Deputados, e
filtrados para obter as propostas apresentadas por um deputado
federal qualquer
"""

import pandas as pd
import requests
from bs4 import BeautifulSoup


def make_excerpt(text):
    excerpt = text

    if (len(text) > 110):
        excerpt = text[:110]
        excerpt += '...'

    return excerpt


def url_from_proposition(id):
    payload = {'IdProp': id}
    r = requests.get(
        "http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ObterProposicaoPorID",
        params=payload)

    soup = BeautifulSoup(r.content, 'xml')

    return soup.proposicao.LinkInteiroTeor.text


def get_props_by_type(name, year, prop_type):
    print("Obtendo as proposições de {0} do deputado...".format(year))

    payload = {
        'sigla': prop_type,
        'numero': '',
        'ano': year,
        'datApresentacaoIni': '',
        'datApresentacaoFim': '',
        'parteNomeAutor': name,
        'idTipoAutor': '',
        'siglaPartidoAutor': '',
        'siglaUFAutor': '',
        'generoAutor': '',
        'codEstado': '',
        'codOrgaoEstado': '',
        'emTramitacao': ''
    }

    r = requests.get("http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes",
                     params=payload)

    soup = BeautifulSoup(r.content, 'xml')

    propositions = soup.find_all('proposicao')

    number_of_propositions = len(propositions) - 1

    result = list()

    for i in range(0, number_of_propositions):
        url = url_from_proposition(propositions[i].id.text)
        description = make_excerpt(propositions[i].txtEmenta.text)

        result.append({
            'id': propositions[i].id.text,
            'siglum': propositions[i].tipoProposicao.sigla.text,
            'number': propositions[i].numero.text,
            'year': propositions[i].ano.text,
            'description': description,
            'status': propositions[i].situacao.descricao.text,
            'url': url
        })

    return result


def get_data_from_deputie(name, year):
    result = list()
    result.extend(get_props_by_type(name, year, 'pec'))
    result.extend(get_props_by_type(name, year, 'pl'))
    result.extend(get_props_by_type(name, year, 'rcp'))
    result.extend(get_props_by_type(name, year, 'rem'))

    columns = ['id', 'siglum', 'number',
               'description', 'year', 'status', 'url']
    df = pd.DataFrame(result, columns=columns)

    return df


def main():
    print(get_data_from_deputie("vitor valim", 2017))


if __name__ == '__main__':
    main()
