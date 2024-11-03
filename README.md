# TourismTrends

Structure

/backend/

- example node js app the connects with a mysql backend running locally on port 3000

/backend/bin/www

- main load file called by package.js
- this then calls app.js where most of the work happens

You could try to get this working

- cd backend
- npm update
- you'll also need mysql running with the sql_file found at /sql_file loaded
- update mysql username and password in .env

otherwise you'll see that a lot of what we need is already there

1. user login and register routes (I think we only need login)
2. api-docs route for swagger documentation
3. a data route

This can also server a static frontend but ignore that as we'll server a react frontend on a different port.

We can talk over some of this on Friday.
