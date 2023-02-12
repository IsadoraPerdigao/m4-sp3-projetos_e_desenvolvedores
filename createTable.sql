CREATE TYPE OS AS ENUM ('WINDOWS', 'LINUX', 'MACOS');

CREATE TABLE developer_infos (
	id SERIAL PRIMARY KEY,
	"developerSince" DATE NOT NULL,
	"preferredOS" OS NOT NULL
);

CREATE TABLE developers (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	"developerInfoId" INTEGER UNIQUE,
	FOREIGN KEY ("developerInfoId") REFERENCES developer_infos("id") ON DELETE SET NULL
);

CREATE TABLE projects (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" varchar(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE,
	"developerId" INTEGER NOT NULL,
	FOREIGN KEY ("developerId") REFERENCES developers("id") ON DELETE CASCADE  
);

CREATE TABLE technologies (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL
);

CREATE TABLE projects_technologies (
	id SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"projectId" INTEGER NOT NULL,
	"technologyId" INTEGER NOT NULL,
	FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE CASCADE,
	FOREIGN KEY ("technologyId") REFERENCES technologies(id) ON DELETE CASCADE 
);
