"""Implementação da captação das votações de um senador

Os dados são obtidos da API do Senado, e filtrados para obter os
dados desejados dos senadores cearenses.
"""

import requests
from bs4 import BeautifulSoup

from data_capture.federal_senate.helpers import make_excerpt


def get_individual_proposition(id):
    r = requests.get(
        "http://legis.senado.leg.br/dadosabertos/materia/{}".format(id))
    soup = BeautifulSoup(r.content, 'xml')
    materia = soup.Materia

    type_description = materia.IdentificacaoMateria.DescricaoSubtipoMateria.text
    description = make_excerpt(materia.DadosBasicosMateria.EmentaMateria.text)

    return {
        'description': description,
        'siglum': materia.IdentificacaoMateria.SiglaSubtipoMateria.text,
        'number': materia.IdentificacaoMateria.NumeroMateria.text,
        'year': materia.IdentificacaoMateria.AnoMateria.text,
        'type_description': type_description
    }


def get_data_from_senator(id):

    print("Obtendo votações do senador ".format(id))
    payload = {'sigla': 'pec'}
    r = requests.get(
        "http://legis.senado.leg.br/dadosabertos/senador/{0}/votacoes".format(
            id), params=payload)

    soup = BeautifulSoup(r.content, 'xml')

    polls = soup.find_all('Votacao')

    number_of_polls = len(polls) - 1

    all_votes = {
        'yes': list(),
        'no': list(),
        'abstention': list(),
        'secret': list()
    }

    for i in range(0, number_of_polls):
        votation_data = {
            'session_code': polls[i].CodigoSessao.text,
            'votation_title': polls[i].DescricaoVotacao.text,
            'secret_poll': polls[i].IndicadorVotacaoSecreta.text,
            'result': polls[i].DescricaoResultado.text,
            'vote': polls[i].DescricaoVoto.text
        }
        votation_data.update(get_individual_proposition(
            polls[i].IdentificacaoMateria.CodigoMateria.text))

        if polls[i].IndicadorVotacaoSecreta.text == 'Sim':
            all_votes['secret'].append(votation_data)
        else:
            voto = polls[i].DescricaoVoto.text
            if voto == 'Sim':
                all_votes['yes'].append(votation_data)
            elif voto == 'Não':
                all_votes['no'].append(votation_data)
            else:
                all_votes['abstention'].append(votation_data)

    return all_votes


def main():
    print(get_data_from_senator(615))


if __name__ == '__main__':
    main()

# esse aqui é pra usar um xml local
'''
def get_data_from_senator():

    print('Obtendo os dados do senador...')

    soup = BeautifulSoup(open("/home/lord/politicos_ce/data_capture/federal_senate/votations_local_sample.xml"), 'xml')

    dados = soup.find_all('Votacao')

    tamanho = len(dados) - 1

    for i in range(0, tamanho):
        print("Código da sessão:")
        print(dados[i].CodigoSessao.text)
        print("Título da votação:")
        print(dados[i].DescricaoVotacao.text)
        print("Voto:")
        print(dados[i].DescricaoVoto.text)
        print("")


def main():
    get_data_from_senator()


if __name__ == '__main__':
    main()
 '''
