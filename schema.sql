create table if not exists routes (
  id integer primary key autoincrement,
  street text not null,
  weekday text,
  from_time integer,
  to_time integer,
  side integer,
  weeks integer
);

create table if not exists path (
  id integer primary key autoincrement,
  lat real,
  lng real,
  route integer,
  foreign key(route) references routes(id)
);

