"""Arquivo com a configuração das rotas da aplicação"""
from flask import render_template
from app import app, db
from app.models import Politician


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/politician-list/<position>')
def politician_list(position):
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

    return render_template('politician_list.html', title=title, politicians=politicians)
