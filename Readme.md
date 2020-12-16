# Sonnenstrahl Energie Project
![](https://github.com/ToKoSoftware/dhbw-sonnenstrahl/workflows/CI/badge.svg)


This is a university assignment project for the course of Web-Development (WWI2019A).


## Screenshots

Home             |  Find Plans
:-------------------------:|:-------------------------:
![](https://raw.githubusercontent.com/ToKoSoftware/dhbw-sonnenstrahl/main/screenshots/Screenshot1.png)  |  ![](https://raw.githubusercontent.com/ToKoSoftware/dhbw-sonnenstrahl/main/screenshots/Screenshot2.png)
My Orders             |  Edit Customers associated to own Profile
![](https://raw.githubusercontent.com/ToKoSoftware/dhbw-sonnenstrahl/main/screenshots/Screenshot3.png)  |  ![](https://raw.githubusercontent.com/ToKoSoftware/dhbw-sonnenstrahl/main/screenshots/Screenshot4.png)
Change credentials             |  Admin - Edit Plans
![](https://raw.githubusercontent.com/ToKoSoftware/dhbw-sonnenstrahl/main/screenshots/Screenshot5.png)  |  ![](https://raw.githubusercontent.com/ToKoSoftware/dhbw-sonnenstrahl/main/screenshots/Screenshot6.png)


## Installation - Docker
**This is the recommended way**

0. You need to have docker installed
1. Create a `.env` file and fill in your desired database configuration:

```
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=sonnenstrahl
JWT_HASH=randomstr
```
**Warning** This file should not be commited to the repository!

2. run `docker-compose up`. Docker will pull all images for you and automatically set everting up.
3. postgresql should now be running on port `5432`, the express server should be running at port `80`

## Installation - Without Docker
0. You need to have a local working postgresql installation running
1. In `server` run `npm install` (`cd server && npm install`)
2. Run migrations and seeders, see section below
3. To start a local 
  - developent server, which restarts on filechange run 
  ```bash
  PORT=80 LOGGING=true JWT_HASH=abc DATABASE_URL=localhost DATABASE_NAME=sonnenstrahl DATABASE_USER=postgres DATABASE_PASSWORD=postgres npm run dev
  ```
  - production server, run 
  ```bash
  PORT=80 LOGGING=true JWT_HASH=abc DATABASE_URL=localhost DATABASE_NAME=sonnenstrahl DATABASE_USER=postgres DATABASE_PASSWORD=postgres npm start
  ```
  **Remember to fill in your own database configuaration**
  
4. Open a new terminal window. In `frontend` run `npm install` (`cd frontend && npm install`)
5. To start an Angular Dev Server run run `npm start`
6. The API should be running on port `80`; The Angular development server should be running on port `4200` 

## Migrations

To run a database migration run `cd server && npm run db:migrate`. The Docker container will do this automatically on restart.

To undo a database migration run `cd server && npm run db:migrate:undo`.

