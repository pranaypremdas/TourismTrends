# TourismTrends

## Node js Express API

### DB Setup

There's a sql file in /backend/sql_file

- try loading it into mysql Workbench

The .env would not have come across.
Copy the following into a ".env" file and save at /backend/.env
update your user and pw from mysql

MYSQL_USER=<your_mysql_user>
MYSQL_PASSWORD=<your_mysql_pw>
MYSQL_DATABASE="tourism"
DEBUG="tourism-trends-api:server"
JWT_SECRET="my-super-secret-jwt-salt-key"

There is a 'admin' account saved in the 'users' table

email: admin@tourismtrends.com
ps: admin

### Insomnia

There is a insomnia export .json to import into your insomnia
/backend/insomnia

### Routes

All routes require a valid JWT (except for api-docs)

/api-docs

- swagger documentation
- https://localhost:3000/api-docs/#/
- you'll need to look at this on a browser and not insomnia
- see for detailed information on the below

/trends

- main data route
- needs valid JWT

/user/trends/add

- user can add data about their client

/user/trends/get

- user can get data about their client

/user/trends/delete

- user can delete data about their client

/user/register

- client_admin can create users for that client
- site_admin can create all users

/user/login

- returns a jwt for a valid username && password

## React Frontend

### Starting application
change directory into front-end by `cd /react-frontend` and run `npm start`


### Routes for front end

/ or /home
- directs user to home page

/dashboard
- directs user to the dashboard

/contact
- directs user to the contact page for recieving quotes

/login
- directs user to the login page
