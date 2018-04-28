"""Implementação da captação das votações de um senador

Os dados são obtidos da API do Senado, e filtrados para obter os
dados desejados dos senadores cearenses.
"""

import requests
from bs4 import BeautifulSoup

def get_data_from_senator(id):

	print('Obtendo os dados do senador...')

	r = requests.get("http://legis.senado.leg.br/dadosabertos/senador/{0}/votacoes".format(id))

	soup = BeautifulSoup(r.content, 'xml')

	dados = soup.find_all('Votacao')

	tamanho = len(dados) - 1

	print(tamanho)

	for i in range(0, tamanho):
		print("Código da sessão:")
		print(dados[i].CodigoSessao.text)
		print("Título da votação:")
		print(dados[i].DescricaoVotacao.text)
		print("Voto:")
		print(dados[i].DescricaoVoto.text)
		print("")

def main():
	get_data_from_senator(615)


if __name__ == '__main__':
	main()

#esse aqui é pra usar um xml local
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