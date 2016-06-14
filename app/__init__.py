import os
import sqlite3

from flask import Flask

app = Flask(__name__)
app.config.from_object('config')
