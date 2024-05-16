# Task Manager

> To run this project you must at least have Docker installed and running in your machine. It is recomended to use Docker Desktop.

## Description

Task manager app (NestJS API & Angular APP)

## Requirements

- [NodeJS](https://nodejs.org/en): ~ v20.0.0
- [Docker Desktop](https://www.docker.com/products/docker-desktop/): ~ v26.1.1

## Instructions

Instructions on how to run each aplication are described in it's respective README.md files.

## Running locally

You can execute the environment locally by just building the docker compose file.

Access the root folder of this project: `~/task-manager` and run: `docker compose up --build -d`

> This will install all dependencies and build both the API and the APP, create a Postgres database and start the API at the address: `http://localhost:3333/api/` and the APP at the address: `http://localhost:8080/`.

If everything went sucessfully, you should see something similar to this:

![docker-compose-build screenshot](./docs/img/docker-compose-build.png)

Now, you can just access `http://localhost:8080/` and it will redirect you to the application sign in page.

> It is recomended that you try accessing from a Incongnito Windows on Chrome: Ctrl + Shift + N

To check the API documentation via Swagger, just go to `http://localhost:3333/docs`.
