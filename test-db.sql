DROP DATABASE IF EXISTS testdb;

CREATE DATABASE testdb;

\c testdb

CREATE TABLE IF NOT EXISTS Jokes
(
    id serial PRIMARY KEY,
    joke VARCHAR (512)
);

ALTER TABLE Jokes
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS Comments
(
    id      SERIAL PRIMARY KEY,
    joke_id INT REFERENCES jokes (id),
    message VARCHAR
);

ALTER TABLE Comments
    OWNER TO postgres;
