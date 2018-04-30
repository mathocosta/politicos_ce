"""Implementação da captação das propostas de um deputado federal

Os dados são obtidos da API do Senado, e filtrados para obter os
dados desejados dos senadores cearenses.
"""

import requests
from bs4 import BeautifulSoup

def get_data_from_senator(nome):

	print('Obtendo as proposições do deputado...')

	r = requests.get("http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes?sigla=&numero=&ano=&datApresentacaoIni=&datApresentacaoFim=&parteNomeAutor={0}&idTipoAutor=&siglaPartidoAutor=&siglaUFAutor=&generoAutor=&codEstado=&codOrgaoEstado=&emTramitacao=".format(nome))

	soup = BeautifulSoup(r.content, 'xml')

	dados = soup.find_all('proposicao')

	tamanho = len(dados) - 1

	print(tamanho)

	retorno = {}

	for i in range(0, tamanho):
		retorno[i] = {
			'proposition_code' : dados[i].id.text,
			'proposition_name' : dados[i].nome.text,
			'type' : dados[i].tipoProposicao.sigla.text,
			'proposition_number' : dados[i].numero.text,
			'year' : dados[i].ano.text,
			'proposition_date' : dados[i].datApresentacao.text,
			'title' : dados[i].txtExplicacaoEmenta.text,
			'description' : dados[i].txtEmenta.text,
			'ongoing' : dados[i].situacao.descricao.text
			
		}

	return retorno

def main():
	print(get_data_from_senator("vitor valim"))


if __name__ == '__main__':
	main()