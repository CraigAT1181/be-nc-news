# Northcoders News API

Thanks for checking out my project!

#H Live Server

You'll find the hosted version at:
https://northcoders-project.onrender.com

#H Project

So far, this forms the back-end of the Northcoders News App. It comprises a fully-functioning server that interacts with a database featuring article, user, topic and comment tables.

#H Tech Spec

Node.js - v20.5.1
PostGres - v14.9
Express.js
Jest

#H Running Locally

- Clone

git clone https://github.com/CraigAT1181/backend-project

- Run

npm install

- Environment Setup

In the root directory:

- Create .env.development (dev environment)
  and add: PGDATABASE=nc_news_test

- Create .env.test (test environment)
  and add: PGDATABASE=nc_news

* Run Commands

npm run setup-dbs
npm run seed

#H Testing

To test, use the following command:

npm run test
