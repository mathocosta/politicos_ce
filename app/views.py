"""Arquivo com a configuração das rotas da aplicação

Obs.: Todas as consultas com o banco de dados retornam instâncians de objetos
da entidade específica, que está modelada no `models.py`.
"""
from flask import render_template, request

from app import app, db
from app.models import Politician
from data_capture.federal_deputies.fetch_proposed import \
    get_data_from_deputie as get_props_from_deputie
from data_capture.federal_senate.fetch_proposed import \
    get_data_from_senator as get_props_from_senator
from data_capture.federal_senate.fetch_voted_propositions import \
    get_data_from_senator as get_votes_from_senator


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


@app.route('/politician/<int:politician_id>')
def show_politician_page(politician_id):
    politician_data = Politician.query.get_or_404(politician_id)
    position = ""
    propositions = list()
    votes = list()

    if politician_data.position == 'senator':
        position = 'Senador'
        propositions = get_props_from_senator(politician_data.registered_id)
        votes = get_votes_from_senator(politician_data.registered_id)
    elif politician_data.position == 'federal-deputy':
        position = 'Deputado Federal'
        propositions = get_props_from_deputie(
            politician_data.parliamentary_name)
    elif politician_data.position == 'state-deputy':
        position = 'Deputado Estadual'

    return render_template(
        "politician.html", politician_data=politician_data,
        position=position, propositions=propositions[:5], votes=votes)
