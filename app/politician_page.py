# -*- coding: utf-8 -*-
"""Aqui ficam somente as configurações da página do político"""
import datetime

import pandas as pd
from flask import Blueprint, jsonify, render_template, request
from flask.views import MethodView, View

import data_capture.federal_deputies as fd
import data_capture.federal_senate as fs
import data_capture.state_deputies as sd
from app import cache, update_cache_value
from app.models import Politician

page = Blueprint('politician_page', __name__, template_folder='templates')


class ShowPoliticianPage(View):
    def dispatch_request(self, politician_id):
        self.politician_data = Politician.query.get_or_404(politician_id)
        self.position = ""

        self.propositions, self.votes, self.candidacies = self.fetch_external_data()

        return render_template("politician.html",
                               politician_data=self.politician_data,
                               position=self.position,
                               propositions=self.propositions,
                               votes=self.votes,
                               candidacies= self.candidacies)

    def fetch_external_data(self):
        politician_id = self.politician_data.id
        registered_id = self.politician_data.registered_id
        propositions = list()
        votes = dict.fromkeys(
            ['yes', 'no', 'abstention', 'secret'], list())
        candidacies = list()

        if self.politician_data.position == 'senator':
            self.position = 'Senador'
            propositions = self._fetch_propositions(
                politician_id, registered_id, fs.get_props_from_senator)
            candidacies = fs.candidacies_data_from_senator(
                self.politician_data.civil_name)
        elif self.politician_data.position == 'federal-deputy':
            self.position = 'Deputado Federal'
            registered_id = self.politician_data.parliamentary_name
            propositions = self._fetch_propositions(
                politician_id, registered_id, fd.get_props_from_deputy)
            candidacies = fd.candidacies_data_from_deputy(
                self.politician_data.civil_name)
        elif self.politician_data.position == 'state-deputy':
            self.position = 'Deputado Estadual'
            candidacies = sd.candidacies_data_from_deputy(
                self.politician_data.civil_name)

        return propositions, votes, candidacies

    def _fetch_propositions(self, politician_id, registered_id, callback):
        propositions_key = "{}-propositions".format(politician_id)
        propositions = cache.get(propositions_key)

        if propositions is None:
            current_year = datetime.datetime.now().year
            df = pd.concat([callback(registered_id, current_year),
                            callback(registered_id, current_year - 1)])
            update_cache_value(propositions_key, df)
            propositions = df.to_dict('records')

        return propositions


politician_page_view = ShowPoliticianPage.as_view('show_politician_page')
page.add_url_rule('/politician/<int:politician_id>',
                  view_func=politician_page_view)


class PoliticianPageAPI(MethodView):
    PROP_DF_COLUMNS = ['id', 'siglum', 'number',
                       'description', 'year', 'status', 'url']
    POLLS_DF_COLUMNS = ['id', 'number', 'year', 'siglum', 'secret_poll',
                        'result', 'description', 'url', 'number_of_polls', 'polls']
    VOTES_DF_COLUMNS = ['id', 'number', 'year', 'siglum',
                        'secret_poll', 'result', 'description', 'url', 'vote']

    def get(self):
        politician_id = request.args.get('id', None)

        if not politician_id:
            return

        graph = request.args.get('graph', 1)
        year = request.args.get('year', datetime.datetime.now().year)

        self.politician_data = Politician.query.get_or_404(politician_id)

        if int(graph) == 1:
            return self._props_status_number(year)
        elif int(graph) == 2:
            return self._props_types_number(year)
        else:
            df = self._fetch_polls(year)
            return jsonify(df.to_dict('records'))

    def _props_status_number(self, year):
        position = self.politician_data.position
        props_df = None

        if position == 'senator':
            registered_id = self.politician_data.registered_id
            props_df = self._fetch_propositions(
                registered_id, year, fs.get_props_from_senator)
        elif position == 'federal-deputy':
            registered_id = self.politician_data.parliamentary_name
            props_df = self._fetch_propositions(
                registered_id, year, fd.get_props_from_deputy)

        return jsonify(props_df.status.value_counts().to_dict())

    def _props_types_number(self, year):
        position = self.politician_data.position
        props_df = None

        if position == 'senator':
            registered_id = self.politician_data.registered_id
            props_df = self._fetch_propositions(
                registered_id, year, fs.get_props_from_senator)
        elif position == 'federal-deputy':
            registered_id = self.politician_data.parliamentary_name
            props_df = self._fetch_propositions(
                registered_id, year, fd.get_props_from_deputy)

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
        saved_propositions = cache.get(propositions_key)
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

    def _fetch_polls(self, year):
        politician_position = self.politician_data.position
        registered_id = self.politician_data.registered_id

        polls_dataset_key = 'deputies_votes_dataset'
        polls_dataset = cache.get(polls_dataset_key)

        votes_key = "{}-votes".format(self.politician_data.id)
        saved_votes = cache.get(votes_key)

        filtered_df = None
        df = None

        if saved_votes is None:
            if politician_position == 'senator':
                df = fs.get_votes_from_senator(registered_id, year)
                update_cache_value(votes_key, df)
                filtered_df = df
            elif politician_position == 'federal-deputy':
                polls_df = pd.DataFrame(
                    polls_dataset, columns=self.POLLS_DF_COLUMNS)

                if polls_dataset is None:
                    polls_df = fd.get_voting_data(year)
                elif year not in polls_df.year.tolist():
                    polls_df = pd.concat(polls_df, fd.get_voting_data(year))

                update_cache_value(polls_dataset_key, polls_df)

                df = fd.get_votes_from_deputy(registered_id, polls_df)
                update_cache_value(votes_key, df)

                filtered_df = df[df.year == year]
        else:
            df = pd.DataFrame(saved_votes,
                              columns=self.VOTES_DF_COLUMNS)
            years = df.year.tolist()
            if year not in years:
                if politician_position == 'senator':
                    df = pd.concat(
                        [df, fs.get_votes_from_senator(registered_id, year)],
                        sort=True)
                    update_cache_value(votes_key, df)
                elif politician_position == 'federal-deputy':
                    polls_df = pd.DataFrame(
                        polls_dataset, columns=self.POLLS_DF_COLUMNS)
                    if year not in polls_df.year.tolist():
                        polls_df = pd.concat(
                            [polls_df, fd.get_voting_data(year)])
                        update_cache_value(polls_dataset_key, polls_df)

                    df = pd.concat(
                        [df, fd.get_votes_from_deputy(registered_id, polls_df)])
                    update_cache_value(votes_key, df)

            filtered_df = df[df.year == year]

        return filtered_df


politician_page_api_view = PoliticianPageAPI.as_view('politician_page_api')
page.add_url_rule('/politician/api/',
                  view_func=politician_page_api_view, methods=['GET'])
