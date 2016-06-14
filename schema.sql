drop table if exists entries;
create table routes (
  id integer primary key autoincrement,
  street text not null,
  weekday text,
  from_time integer,
  to_time integer,
  side integer,
  weeks integer
);

create table path (
  id integer primary key autoincremnt,
  lat real,
  lng real,
  route integer,
  foreign key(route) references routes(id)
);

