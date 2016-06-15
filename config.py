import os
basedir = os.path.abspath(os.path.dirname(__file__))

DATABASE = os.path.join(basedir,'app.db')

USERNAME = 'admin'
PASSWORD = 'default'

SECRET_KEY = 'dev-key'
