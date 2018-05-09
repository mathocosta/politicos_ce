# -*- coding: utf-8 -*-
"""Arquivo com os modelos usados no banco de dados"""
from app import db, whooshee


@whooshee.register_model(
    'civil_name', 'parliamentary_name', 'party_siglum', 'position')
class Politician(db.Model):
    """Entidade que representa e guarda os dados de um político"""
    __tablename__ = 'politicians'

    id = db.Column('id', db.Integer, primary_key=True)
    registered_id = db.Column('registered_id', db.Integer)
    civil_name = db.Column('civil_name', db.String(80))
    parliamentary_name = db.Column('parliamentary_name', db.String(80))
    # party_id = db.Column('party_id', db.Integer, db.ForeignKey(
    #     'political_parties.id'), nullable=False)
    party_siglum = db.Column('party_siglum', db.String(80))
    scholarity = db.Column('scholarity', db.String(80))
    hometown = db.Column('hometown', db.String(80))
    position = db.Column('position', db.String(80))
    photo_url = db.Column('photo_url', db.String(255))

    def __init__(self, registered_id, civil_name, parliamentary_name,
                 scholarity, hometown, party_siglum, position, photo_url):
        self.registered_id = registered_id
        self.civil_name = civil_name
        self.parliamentary_name = parliamentary_name
        self.scholarity = scholarity
        self.hometown = hometown
        self.party_siglum = party_siglum
        self.position = position
        self.photo_url = photo_url

# class Candidacy(db.Model):
#     """Entidade que representa e guarda os dados de uma candidatura de um político"""

#     __tablename__ = 'canditacies'

#     id = db.Column('id', db.Integer, primary_key=True)
#     position = db.Column('position', db.String(100))
#     institution = db.Column('institution', db.String(100))
#     elected = db.Column('elected', db.Boolean)
#     date = db.Column('date', db.String(4))
#     election_round = db.Column('election_round', db.Integer)
#     # polician_id = db.Column('polician_id', db.Integer,
#     #                         db.ForeignKey('politicians.id'), nullable=False)

#     def __init__(self, position, institution, elected, date, election_round):
#         self.position = position
#         self.institution = institution
#         self.elected = elected
#         self.date = date
#         self.election_round = election_round

# class Party(db.Model):
#     """Entidade que representa e guardas os dados de um partido político"""

#     __tablename__ = 'political_parties'

#     id = db.Column('id', db.Integer, primary_key=True)
#     name = db.Column('name', db.String(255))
#     abbreviation = db.Column('abbreviation', db.String(10))
#     number = db.Column('number', db.Integer)

#     def __init__(self, name, abbreviation, number):
#         self.name = name
#         self.abbreviation = abbreviation
#         self.number = number
