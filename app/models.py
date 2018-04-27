# -*- coding: utf-8 -*-
"""Arquivo com os modelos usados no banco de dados"""
from app import db


# class Politician(db.Model):
#     """Entidade que representa e guarda os dados de um político"""

#     __tablename__ = 'politicians'

#     id = db.Column('id', db.Integer, primary_key=True)
#     full_name = db.Column('full_name', db.String(255))
#     scholarity = db.Column('scholarity', db.String(255))
#     hometown = db.Column('hometown', db.String(100))
#     party_id = db.Column('party_id', db.Integer, db.ForeignKey(
#         'political_parties.id'), nullable=False)

#     def __init__(self, full_name, scholarity, hometown, party_id):
#         self.full_name = full_name
#         self.scholarity = scholarity
#         self.hometown = hometown
#         self.party_id = party_id


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


# class Candidacy(db.Model):
#     """Entidade que representa e guarda os dados de uma candidatura de um político"""

#     __tablename__ = 'canditacies'

#     id = db.Column('id', db.Integer, primary_key=True)
#     position = db.Column('position', db.String(100))
#     elected = db.Column('elected', db.Boolean)
#     year = db.Column('year', db.String(4))
#     polician_id = db.Column('polician_id', db.Integer,
#                             db.ForeignKey('politicians.id'), nullable=False)

#     def __init__(self, position, year, elected, polician_id):
#         self.position = position
#         self.year = year
#         self.elected = elected
#         self.polician_id = polician_id
