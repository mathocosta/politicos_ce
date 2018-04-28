"""Implementação da captação das propostas de um senador

Os dados são obtidos da API do Senado, e filtrados para obter os
dados desejados dos senadores cearenses.
"""

import requests
from bs4 import BeautifulSoup

def get_data_from_senator(id):

	print('Obtendo os dados do senador...')

	r = requests.get("http://legis.senado.gov.br/dadosabertos/senador/{0}".format(id))

	soup = BeautifulSoup(r.content, 'xml')

	dados = soup.find_all('Materia')

	tamanho = len(dados) - 1

	print(tamanho)

	retorno = {}

	for i in range(0, tamanho):
		retorno[i] = {
			'proposition_code' : dados[i].CodigoMateria.text,
			'type' : dados[i].SiglaSubtipoMateria.text,
			'proposition_number' : dados[i].NumeroMateria.text,
			'year' : dados[i].AnoMateria.text,
			'description' : dados[i].EmentaMateria.text
		}

	return retorno

def main():
	print(get_data_from_senator(5322))


if __name__ == '__main__':
	main()