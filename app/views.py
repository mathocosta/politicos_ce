"""Arquivo com a configuração das rotas gerais da aplicação

Obs.: Todas as consultas com o banco de dados retornam instâncians de objetos
da entidade específica, que está modelada no `models.py`.
"""
from flask import render_template, request
from flask.views import MethodView, View
from unidecode import unidecode

from app import app
from app.models import Politician


# INDEX PAGE
@app.route('/')
def index():
    return render_template('index.html')


# SEARCH RESULTS PAGE
@app.route('/search')
def show_search_results():
    name_field_text = request.args.get('name_field')
    politicians = Politician.query.whooshee_search(
        unidecode(name_field_text)).all()

    # Não tem como fazer a filtragem por padrão, portanto coloquei para
    # acontecer o filtro depois de obtidos os resultados da busca.
    position = request.args.get('position_field', None)
    if position is not None:
        politicians = [p for p in politicians if p.position == position]

    title = "Resultados da busca"

    if position == 'federal-deputy':
        title = "Resultados da busca nos dep. federais por \"{0}\"".format(
            name_field_text)
    elif position == 'senator':
        title = "Resultados da busca nos senadores por \"{0}\"".format(
            name_field_text)
    elif position == 'state-deputy':
        title = "Resultados da busca nos dep. estaduais por \"{0}\"".format(
            name_field_text)

    return render_template(
        'politician_list.html', title=title, politicians=politicians)


# KNOW MORE PAGE
@app.route('/know-more')
def show_know_more():
    return render_template('know_more.html')


# POLITICIAN LIST PAGE
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


#SERVICE WORKER AND MANIFEST
@app.route('/manifest.json', methods=['GET'])
def manifest():
    return app.send_static_file('manifest.json')  

@app.route('/sw.js', methods=['GET'])
def sw():
    return app.send_static_file('sw.js')    
