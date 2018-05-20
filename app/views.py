"""Arquivo com a configuração das rotas da aplicação

Obs.: Todas as consultas com o banco de dados retornam instâncians de objetos
da entidade específica, que está modelada no `models.py`.
"""
import pandas as pd
from flask import render_template, request
from werkzeug.contrib.cache import SimpleCache

from app import app, db
from app.models import Politician
from data_capture.federal_deputies.fetch_proposed import \
    get_data_from_deputie as get_props_from_deputie
from data_capture.federal_senate.fetch_proposed import \
    get_data_from_senator as get_props_from_senator
from data_capture.federal_senate.fetch_voted_propositions import \
    get_data_from_senator as get_votes_from_senator

c = SimpleCache()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/search')
def show_search_results():
    # FIXME: Não tem algo para verificar se o campo 'name' está vazio.
    politicians = Politician.query.whooshee_search(
        request.args.get('name_field')).all()

    # Não tem como fazer a filtragem por padrão, portanto coloquei para
    # acontecer o filtro depois de obtidos os resultados da busca.
    position = request.args.get('position_field', None)
    if position is not None:
        politicians = [p for p in politicians if p.position == position]

    title = 'Resultados da busca'

    return render_template(
        'politician_list.html', title=title, politicians=politicians)


@app.route('/politician-list/<position>')
def show_politician_list(position):
    title = ""
    politicians = list()

    if position == 'senator':
        title = "Senadores"
        politicians = Politician.query.filter_by(position='senator')
    elif position == 'federal-deputy':
        title = "Deputados Federais"
        politicians = Politician.query.filter_by(position='federal-deputy')
    elif position == 'state-deputy':
        title = "Deputados Estaduais"
        politicians = Politician.query.filter_by(position='state-deputy')

    return render_template(
        'politician_list.html', title=title, politicians=politicians)


def votes_filter(df) -> dict:
    is_secret = df.secret_poll == 'Sim'
    is_yes = df.vote == 'Sim'
    is_no = df.vote == 'Não'

    filtered_votes = dict()
    filtered_votes['secret'] = df.loc[is_secret].to_dict('records')
    filtered_votes['yes'] = df.loc[is_yes].to_dict('records')
    filtered_votes['no'] = df.loc[is_no].to_dict('records')
    # FIXME: Ver outra forma de fazer essa verificação
    filtered_votes['abstention'] = df.loc[(df.secret_poll == 'Não')
                                          & (df.vote != 'Sim')
                                          & (df.vote != 'Não')
                                          ].to_dict('records')

    return filtered_votes


def get_senator_data(id, registered_id):
    propositions_key = "{}-propositions".format(id)
    propositions = c.get(propositions_key)

    votes_key = "{}-votes".format(id)
    votes = c.get(votes_key)

    if propositions is None:
        df = get_props_from_senator(registered_id)
        propositions = df.to_dict('records')
        c.set(propositions_key, propositions, timeout=86400)

    if votes is None:
        df = get_votes_from_senator(registered_id)
        votes = df.to_dict('records')
        c.set(votes_key, votes)

    filtered_votes = votes_filter(pd.DataFrame(votes))

    return propositions, filtered_votes


def get_deputy_data(id, registered_id):
    propositions_key = "{}-propositions".format(id)
    propositions = c.get(propositions_key)

    if propositions is None:
        df = get_props_from_deputie(registered_id)
        propositions = df.to_dict('records')
        c.set(propositions_key, propositions, timeout=86400)

    return propositions


@app.route('/politician/<int:politician_id>')
def show_politician_page(politician_id):
    politician_data = Politician.query.get_or_404(politician_id)
    position = ""
    propositions = list()
    votes = dict.fromkeys(['yes', 'no', 'abstention', 'secret'], list())

    if politician_data.position == 'senator':
        position = 'Senador'
        propositions, votes = get_senator_data(
            politician_id, politician_data.registered_id)
    elif politician_data.position == 'federal-deputy':
        position = 'Deputado Federal'
        propositions = get_deputy_data(
            politician_id, politician_data.parliamentary_name)
    elif politician_data.position == 'state-deputy':
        position = 'Deputado Estadual'

    return render_template(
        "politician.html", politician_data=politician_data,
        position=position, propositions=propositions[:5], votes=votes)
