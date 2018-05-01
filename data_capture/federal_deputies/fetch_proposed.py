"""Implementação da captação das propostas de um deputado federal

Os dados são obtidos da API completa da Câmara dos Deputados, e
filtrados para obter as propostas apresentadas por um deputado
federal qualquer
"""

import requests
from bs4 import BeautifulSoup


def get_data_from_deputie(name):

    print('Obtendo as proposições do deputado...')

    r = requests.get(
        "http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes?sigla=&numero=&ano=&datApresentacaoIni=&datApresentacaoFim=&parteNomeAutor={0}&idTipoAutor=&siglaPartidoAutor=&siglaUFAutor=&generoAutor=&codEstado=&codOrgaoEstado=&emTramitacao=".format(name))

    soup = BeautifulSoup(r.content, 'xml')

    propositions = soup.find_all('proposicao')

    number_of_propositions = len(propositions) - 1

    print(number_of_propositions)

    result = {}

    for i in range(0, number_of_propositions):
        result[i] = {
            'proposition_code': propositions[i].id.text,
            'proposition_name': propositions[i].nome.text,
            'type': propositions[i].tipoProposicao.sigla.text,
            'proposition_number': propositions[i].numero.text,
            'year': propositions[i].ano.text,
            'proposition_date': propositions[i].datApresentacao.text,
            'title': propositions[i].txtExplicacaoEmenta.text,
            'description': propositions[i].txtEmenta.text,
            'ongoing': propositions[i].situacao.descricao.text
        }

    return result


def main():
    print(get_data_from_deputie("vitor valim"))


if __name__ == '__main__':
    main()
