"""Arquivo com a configuração das rotas da aplicação

Obs.: Todas as consultas com o banco de dados retornam instâncians de objetos
da entidade específica, que está modelada no `models.py`.
"""
import datetime

import pandas as pd
from flask import jsonify, render_template, request
from flask.views import MethodView, View
from werkzeug.contrib.cache import SimpleCache

from app import app, db
from app.models import Politician
from data_capture.federal_deputies.fetch_proposed import \
    get_data_from_deputie as get_props_from_deputie
from data_capture.federal_deputies.voted_propositions import (get_votes_from_deputy,
                                                              get_voting_data)
from data_capture.federal_senate.fetch_proposed import \
    get_data_from_senator as get_props_from_senator
from data_capture.federal_senate.fetch_voted_propositions import \
    get_data_from_senator as get_votes_from_senator

c = SimpleCache()
CACHE_TIMEOUT = 86400


def update_cache_value(key, df):
    """Atualiza o valor da key no cache

    Args:
        key (str)
        df (pd.DataFrame): Dados para salvar
    """
    saved = df.to_dict('records')
    c.set(key, saved, timeout=CACHE_TIMEOUT)

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
            propositions = self._fetch_propositions(
                politician_id, registered_id, get_props_from_deputie)
            votes = self._fetch_deputies_votes(registered_id)
        elif self.politician_data.position == 'state-deputy':
            self.position = 'Deputado Estadual'

        return propositions, votes

    def _fetch_propositions(self, politician_id, registered_id, callback):
        propositions_key = "{}-propositions".format(politician_id)
        propositions = c.get(propositions_key)

        if propositions is None:
            current_year = datetime.datetime.now().year
            df = pd.concat([callback(registered_id, current_year),
                            callback(registered_id, current_year - 1)])
            propositions = df.to_dict('records')
            c.set(propositions_key, propositions, timeout=86400)

        return propositions

    # NOTE: Isso está separado por enquanto, pois ainda não pensei numa
    # forma de juntar os métodos, ou fazer de uma forma mais geral. No mais,
    # abaixo tem o método para as votações dos dep. federais, e depois o que
    # é para os senadores.
    def _fetch_deputies_votes(self, registered_id):
        polls_dataset_key = 'deputies_votes_dataset'
        polls_dataset = c.get(polls_dataset_key)

        if polls_dataset is None:
            df = get_voting_data(datetime.datetime.now().year)
            polls_dataset = df.to_dict('records')
            c.set(polls_dataset_key, polls_dataset, timeout=86400)

        polls_dataset_df = pd.DataFrame(polls_dataset)

        votes_key = "{}-votes".format(self.politician_data.id)
        votes = c.get(votes_key)

        if votes is None:
            df = get_votes_from_deputy(registered_id, polls_dataset_df)
            votes = df.to_dict('records')
            c.set(votes_key, votes, timeout=86400)

        if len(votes) > 1:
            filtered_votes = self._votes_filter(pd.DataFrame(votes))
        else:
            filtered_votes = dict.fromkeys(
                ['yes', 'no', 'abstention', 'secret'], list())

        return filtered_votes

    def _fetch_votes(self, politician_id, registered_id, callback):
        votes_key = "{}-votes".format(politician_id)
        votes = c.get(votes_key)

        if votes is None:
            df = callback(registered_id, datetime.datetime.now().year)
            votes = df.to_dict('records')
            c.set(votes_key, votes, timeout=86400)

        if len(votes) > 1:
            filtered_votes = self._votes_filter(pd.DataFrame(votes))
        else:
            filtered_votes = dict.fromkeys(
                ['yes', 'no', 'abstention', 'secret'], list())

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

# INDIVIDUAL POLITICIAN PAGE API
class PoliticianPageAPI(MethodView):
    PROP_DF_COLUMNS = ['id', 'siglum', 'number',
                       'description', 'year', 'status', 'url']

    def get(self):
        politician_id = request.args.get('id', None)

        if not politician_id:
            return

        graph = request.args.get('graph', 1)
        year = request.args.get('year', datetime.datetime.now().year)

        self.politician_data = Politician.query.get_or_404(politician_id)

        if int(graph) == 1:
            return self._props_status_number(year)
        else:
            return self._props_types_number(year)

    def _props_status_number(self, year):
        position = self.politician_data.position
        props_df = None

        if position == 'senator':
            registered_id = self.politician_data.registered_id
            props_df = self._fetch_propositions(
                registered_id, year, get_props_from_senator)
        elif position == 'federal-deputy':
            registered_id = self.politician_data.parliamentary_name
            props_df = self._fetch_propositions(
                registered_id, year, get_props_from_deputie)

        return jsonify(props_df.status.value_counts().to_dict())

    def _props_types_number(self, year):
        position = self.politician_data.position
        props_df = None

        if position == 'senator':
            registered_id = self.politician_data.registered_id
            props_df = self._fetch_propositions(
                registered_id, year, get_props_from_senator)
        elif position == 'federal-deputy':
            registered_id = self.politician_data.parliamentary_name
            props_df = self._fetch_propositions(
                registered_id, year, get_props_from_deputie)

        return jsonify(props_df.siglum.value_counts().to_dict())

    def _fetch_propositions(self, registered_id, year, callback):
        """Obtém os dados das proposições por ano. Caso não tenha do ano
        solicitado, é baixado novamente e adicionado aos dados já salvos.

        Args:
            registered_id (int): id do político
            year (int): ano solicitado
            callback (function): função que retorna os dados.

        Returns:
            list: dados solicitados
        """
        propositions_key = "{}-propositions".format(self.politician_data.id)
        saved_propositions = c.get(propositions_key)
        filtered_propositions = dict()
        df = None

        if saved_propositions is None:
            df = callback(registered_id, year)
            update_cache_value(propositions_key, df)
        else:
            df = pd.DataFrame(saved_propositions,
                              columns=self.PROP_DF_COLUMNS)
            years = df.year.tolist()
            if year not in years:
                df = pd.concat([df, callback(registered_id, year)])
                update_cache_value(propositions_key, df)

        filtered_propositions = df[df.year == year]

        return filtered_propositions


politician_page_api = PoliticianPageAPI.as_view('politician_page_api')
app.add_url_rule('/politician/api/',
                 view_func=politician_page_api, methods=['GET'])
