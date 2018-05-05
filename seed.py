# -*- coding: utf-8 -*-
"""Código que coloca os dados necessários no banco de dados"""
from decouple import config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import data_capture.federal_deputies.politician_data as fd
import data_capture.federal_senate.politician_data as fs
import data_capture.state_deputies.politician_data as sd
from app.models import Politician
from data_capture.state_deputies.dataset import \
    fetch_dataset as fetch_sd_dataset

engine = create_engine(config('SQLALCHEMY_DATABASE_URI'))
Session = sessionmaker(bind=engine)
session = Session()


def save_political_data(data):
    for p in data:
        new_politician = Politician(
            p['civil_name'], p['parliamentary_name'], p['scholarity'], p['hometown'], p['party'], p['position'])
        session.add(new_politician)


def save_candidacy_data(data):
    for c in data:
        pass


def seed_database():
    save_political_data(fs.fetch_senators_data())
    save_political_data(fd.fetch_deputies_data())
    save_political_data(sd.political_data_parser(fetch_sd_dataset()))
    session.commit()


def main():
    pass


if __name__ == '__main__':
    main()
