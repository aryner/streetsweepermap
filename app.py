import os
import sqlite3

from flask import Flask, g, render_template

app = Flask(__name__)
app.config.from_object('config')

def connect_db():
  rv = sqlite3.connect(app.config['DATABASE'])
  rv.row_factory = sqlite3.Row
  return rv

def get_db(own_cxt=False):
  if own_cxt:
    return connect_db()

  if not hasattr(g, 'sqlite_db'):
    g.sqlite_db = connect_db()
  return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
  if hasattr(g, 'sqlite_db'):
    g.sqlite_db.close()

def init_db():
  db = get_db()
  with app.open_resource('schema.sql', mode='r') as f:
    db.cursor().executescript(f.read())
  db.commit()

@app.cli.command('initdb')
def initdb_command():
  init_db()
  print 'Initialized the database.'

def add_route(street, weekday, from_time, to_time, side, weeks, path, own_cxt=False):
  db = get_db(own_cxt)
  cursor = db.cursor()
  cursor.execute('insert into routes (street, weekday, from_time, to_time, side, weeks) values (?, ?, ?, ?, ?, ?)',[street,weekday,from_time,to_time,side,weeks])
  db.commit()
  route_id = cursor.lastrowid
  add_path(route_id, path,own_cxt)

def add_path(route_id, path, own_cxt=False):
  db = get_db(own_cxt)
  for p in path:
    db.execute('insert into path (lat, lng, route) values (?, ?, ?)',[p["lat"], p["lng"], route_id])
    db.commit()

def clear_db(own_cxt=False):
  db = get_db(own_cxt)
  db.execute('delete from path where id >= 0')
  db.execute('delete from routes where id >= 0')
  db.commit()

@app.route('/')
def street_cleaning_map():
  db = get_db()
  cursor = db.execute("select * from routes")
  routes = cursor.fetchall()
  return render_template('street_cleaning_map.html',routes=routes)

