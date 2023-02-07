CREATE TYPE OS AS ENUM ('WINDOWS', 'LINUX', 'MACOS');

CREATE TABLE developer_infos (
	id SERIAL,
	developerSince DATE NOT NULL,
	preferredOS OS NOT NULL
);

CREATE TABLE developers (
	id SERIAL,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT null
);

CREATE TABLE projects (
	"id" SERIAL,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" varchar(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE
);

CREATE TABLE technologies (
	id SERIAL,
	name VARCHAR(30) NOT NULL 
);

CREATE TABLE projects_technologies (
	id SERIAL,
	addedIn DATE NOT NULL 
);