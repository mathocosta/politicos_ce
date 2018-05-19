#!/usr/bin/env python
"""Arquivo para o gerenciamento da aplicação"""
from app import app, models
from flask_migrate import MigrateCommand
from flask_script import Manager, Server, Shell
from seed import seed_database

manager = Manager(app)

manager.add_command("runserver", Server(threaded=True))
manager.add_command("shell", Shell())
manager.add_command("db", MigrateCommand)


@manager.command
def seed():
    seed_database()

@manager.command
def clean():
    models.Politician.query.delete()

manager.run()
