import app
import json

app.clear_db(True)
with open('routes.json') as f:
  j = json.load(f)
  #s0-s195
  for i in range(196):
    sector = j["s"+str(i)]["routes"]
    if sector:
      for r in sector:
        side = 0 if r["side"] == 'L' else 1
        weeks = 0
        for d in range(len(r["weeks"])):
          if r["weeks"][d]:
            weeks = weeks + (1 << d)
        paths = []
        for p in r["pathCoords"]:
          paths.append({'lat':p['lat'],'lng':p['lng']})
        app.add_route(r["street"],r["weekday"],int(r["from"][0:2]),int(r["to"][0:2]),side,weeks,paths, True)

