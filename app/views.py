"""Arquivo com a configuração das rotas da aplicação

Obs.: Todas as consultas com o banco de dados retornam instâncians de objetos
da entidade específica, que está modelada no `models.py`.
"""
import pandas as pd
from flask import render_template, request
from flask.views import View, MethodView
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


# INDEX PAGE
@app.route('/')
def index():
    return render_template('index.html')


# SEARCH RESULTS PAGE
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


# INDIVIDUAL POLITICIAN PAGE
class ShowPoliticianPage(View):

    def dispatch_request(self, politician_id):
        self.politician_data = Politician.query.get_or_404(politician_id)
        self.position = ""

        self.propositions, self.votes = self.fetch_external_data()

        return render_template("politician.html",
                               politician_data=self.politician_data,
                               position=self.position,
                               propositions=self.propositions,
                               votes=self.votes)

    def fetch_external_data(self):
        politician_id = self.politician_data.id
        registered_id = self.politician_data.registered_id
        propositions = list()
        votes = dict.fromkeys(
            ['yes', 'no', 'abstention', 'secret'], list())

        if self.politician_data.position == 'senator':
            self.position = 'Senador'
            propositions = self._fetch_propositions(
                politician_id, registered_id, get_props_from_senator)
            votes = self._fetch_votes(
                politician_id, registered_id, get_votes_from_senator)
        elif self.politician_data.position == 'federal-deputy':
            self.position = 'Deputado Federal'
            # FIXME: Remover isso, é pq nao pode (ainda) o id do deputado.
            registered_id = self.politician_data.parliamentary_name
            propositions = self._fetch_propositions(
                politician_id, registered_id, get_props_from_deputie)
        elif self.politician_data.position == 'state-deputy':
            self.position = 'Deputado Estadual'

        return propositions, votes

    def _fetch_propositions(self, politician_id, registered_id, callback):
        propositions_key = "{}-propositions".format(politician_id)
        propositions = c.get(propositions_key)

        if propositions is None:
            df = callback(registered_id)
            propositions = df.to_dict('records')
            c.set(propositions_key, propositions, timeout=86400)

        return propositions

    def _fetch_votes(self, politician_id, registered_id, callback):
        votes_key = "{}-votes".format(politician_id)
        votes = c.get(votes_key)

        if votes is None:
            df = callback(registered_id)
            votes = df.to_dict('records')
            c.set(votes_key, votes)

        filtered_votes = self._votes_filter(pd.DataFrame(votes))

        return filtered_votes

    def _votes_filter(self, df):
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


app.add_url_rule('/politician/<int:politician_id>',
                 view_func=ShowPoliticianPage.as_view('show_politician_page'))
