const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bearerToken = require('express-bearer-token');
const events = require('./events');

const dbConfig = process.env.CLEARDB_DATABASE_URL ? process.env.CLEARDB_DATABASE_URL : {
  host     : 'localhost',
  port     :  3306,
  user     : 'root',
  password : '123456789',
  database : 'mydb',

};

const connection = mysql.createPool(dbConfig);

const port = process.env.PORT || 8090;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bearerToken())
  .use(events(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
// create table orderdetails ( orderid INT unsigned NOT NULL AUTO_INCREMENT, pizzatype varchar(255),pizzaname VARCHAR(255),customername varchar(255),phonenumber varchar(255),address varchar(255)  PRIMARY KEY (orderid));