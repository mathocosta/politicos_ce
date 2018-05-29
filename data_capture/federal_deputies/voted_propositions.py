"""Captação das Votações dos Deputados Federais

A captação está feita com a API antiga da câmara dos deputados, pois a nova não
tem uma forma de fazer. Ao contrário de como funciona nos senadores, aqui são
obtidos os dados das proposições votadas de um ano, filtrados por tipo e com
a lista das votações feitas para cada proposição.
"""
import pandas as pd
import requests
from bs4 import BeautifulSoup


def process_poll(poll):
    votes = poll.find_all('Deputado')
    processed_votes = list()
    for v in votes:
        attrs = v.attrs
        if attrs['UF'] == 'CE':
            processed_votes.append({
                'name': attrs['Nome'],
                'registered_id': int(attrs['ideCadastro']),
                'vote': attrs['Voto'].strip()
            })
    return processed_votes


def get_prop_polls(number, type, year):
    print("Obtendo votações da proposição {0} nº{1}".format(
        type.upper(), number))
    params = {'tipo': type, 'numero': number, 'ano': year}
    r = requests.get(
        "http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ObterVotacaoProposicao",
        params=params)

    soup = BeautifulSoup(r.content, 'xml')
    polls = soup.find_all('Votacao')

    processed_polls = list()
    for poll in polls:
        processed_polls.append(process_poll(poll))

    return processed_polls


def get_prop_data(prop_id):
    params = {'IdProp': prop_id}
    r = requests.get(
        'http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ObterProposicaoPorID',
        params=params)
    soup = BeautifulSoup(r.content, 'xml')

    return {
        'description': soup.Ementa.text,
        'url': soup.LinkInteiroTeor.text
    }


def extract_type_number(prop_name):
    aux = prop_name.split(' ')[1]
    number = aux.split('/')[0]
    year = aux.split('/')[1]

    return number, year


def fetch_all_voted_from_year(year, type):
    print("Obtendo votações de {0} do ano {1}".format(type.upper(), year))
    payload = {'tipo': type.upper(), 'ano': year}
    r = requests.get(
        "http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoesVotadasEmPlenario",
        params=payload)

    soup = BeautifulSoup(r.content, 'xml')
    propositions = soup.find_all('proposicao')

    # Na API esse 1º link retorna todas as votações, não as proposições votadas.
    # Então é repetido a proposta por todas as votações que ela passou. Assim
    # a proposição 123 aparece no mesmo número de vezes que foi votada. Na segunda
    # requisição também retorna todas as votações daquela proposta, ou seja pode
    # duplicar os dados. Por isso foi criado esse auxiliar (processed_ids),
    # para salvar as proposições que já foram processadas.
    processed_ids = list()
    votation_data = list()

    for p in propositions:
        prop_id = p.codProposicao.text
        if prop_id not in processed_ids:
            processed_ids.append(prop_id)

            number, prop_year = extract_type_number(p.nomeProposicao.text)
            polls_list = get_prop_polls(number, type, prop_year)
            prop_data = get_prop_data(prop_id)

            votation_data.append({
                'id': prop_id,
                'number': number,
                'year': year,
                'siglum': type.upper(),
                'secret_poll': '-',
                'result': '-',
                'description': prop_data['description'],
                'url': prop_data['url'],
                'number_of_polls': len(polls_list),
                'polls': polls_list
            })

    return votation_data


def get_voting_data(year):
    """Capta os dados de votações do ano

    Args:
        year (int): Ano desejado

    Returns:
        pd.DataFrame: Dados de votações
    """

    result = list()
    result.extend(fetch_all_voted_from_year(year, 'pec'))
    result.extend(fetch_all_voted_from_year(year, 'mpv'))
    result.extend(fetch_all_voted_from_year(year, 'pl'))

    columns = ['id', 'number', 'year', 'siglum', 'secret_poll',
               'result', 'description', 'url', 'number_of_polls', 'polls']
    df = pd.DataFrame(result, columns=columns)

    return df


def get_votes_from_deputy(id, df):
    """Filtra os dados de votação de um deputado em um conjunto de dados.

    Args:
        id (int): Identificador do deputado
        df (pd.DataFrame): Conjunto de dados

    Returns:
        pd.DataFrame: Conjunto de dados somente com os dados do deputado.
    """
    columns = ['id', 'number', 'year', 'siglum',
               'secret_poll', 'result', 'description', 'url', 'vote']
    deputy_votes_df = pd.DataFrame(columns=columns)

    for i, row in df.iterrows():
        polls = row['polls']
        row_df = pd.DataFrame([row], columns=columns)

        for p in polls:
            filter_list = list(
                filter(lambda dep: dep['registered_id'] == id, p))
            if len(filter_list) > 0:
                row_df['vote'] = filter_list[0]['vote']
                deputy_votes_df = pd.concat(
                    [deputy_votes_df, row_df], ignore_index=True)

    return deputy_votes_df


def main():
    df = get_voting_data(2018)
    print(get_votes_from_deputy(74212, df))


if __name__ == '__main__':
    main()
