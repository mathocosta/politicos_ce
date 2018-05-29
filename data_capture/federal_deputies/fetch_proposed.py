"""Implementação da captação das propostas de um deputado federal

Os dados são obtidos da API completa da Câmara dos Deputados, e
filtrados para obter as propostas apresentadas por um deputado
federal qualquer
"""

import pandas as pd
import requests
from bs4 import BeautifulSoup

HEAD_OPTIONS = {'accept': 'application/xml'}


def make_excerpt(text):
    excerpt = text

    if (len(text) > 110):
        excerpt = text[:110]
        excerpt += '...'

    return excerpt


def get_individual_proposition(id):
    # Antiga API
    # r = requests.get("http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ObterProposicaoPorID?IdProp={}".format(id))

    r = requests.get(
        "https://dadosabertos.camara.leg.br/api/v2/proposicoes/{}".format(id),
        headers=HEAD_OPTIONS)
    soup = BeautifulSoup(r.content, 'xml')

    # return soup.proposicao.LinkInteiroTeor.text
    return {
        "url": soup.dados.urlInteiroTeor.text,
        "status": soup.dados.statusProposicao.descricaoSituacao.text
    }


def get_data_from_deputie(id, year):
    print('Obtendo as proposições do deputado...')

    # Antiga API
    # r = requests.get("http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes?sigla=&numero=&ano=&datApresentacaoIni=&datApresentacaoFim=&parteNomeAutor={0}&idTipoAutor=&siglaPartidoAutor=&siglaUFAutor=&generoAutor=&codEstado=&codOrgaoEstado=&emTramitacao=".format(name))

    payload = {
        'idAutor': id,
        'ano': year,
        'siglaTipo': ['PEC', 'PL', 'RCP', 'REM'],
        'itens': 100,
        'ordem': 'ASC',
        'ordenarPor': 'id'
    }
    r = requests.get("https://dadosabertos.camara.leg.br/api/v2/proposicoes",
                     params=payload, headers=HEAD_OPTIONS)

    soup = BeautifulSoup(r.content, 'xml')

    # propositions = soup.find_all('proposicao')
    propositions = soup.find_all('proposicao_')

    number_of_propositions = len(propositions) - 1

    result = list()

    for i in range(0, number_of_propositions):
        prop = get_individual_proposition(propositions[i].id.text)
        description = make_excerpt(propositions[i].ementa.text)

        result.append({
            'id': propositions[i].id.text,
            'siglum': propositions[i].siglaTipo.text,
            'number': propositions[i].numero.text,
            'description': description,
            'year': propositions[i].ano.text,
            'status': prop['status'],
            'url': prop['url']
        })
        # result.append({
        #     'proposition_code': propositions[i].id.text,
        #     'proposition_name': propositions[i].nome.text,
        #     'type': propositions[i].tipoProposicao.sigla.text,
        #     'proposition_number': propositions[i].numero.text,
        #     'year': propositions[i].ano.text,
        #     'proposition_date': propositions[i].datApresentacao.text,
        #     'title': propositions[i].txtExplicacaoEmenta.text,
        #     'description': propositions[i].txtEmenta.text,
        #     'ongoing': propositions[i].situacao.descricao.text,
        #     'url': url
        # })

    columns = ['id', 'siglum', 'number',
               'description', 'year', 'status', 'url']
    df = pd.DataFrame(result, columns=columns)

    return df


def main():
    print(get_data_from_deputie("vitor valim"))


if __name__ == '__main__':
    main()
