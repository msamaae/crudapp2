// modules
const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 16200;

const { getHomePage } = require('./routes/index');

// create connection to db
let db = mysql.createConnection({
    host: 'xav-p-mariadb01.xavizus.com',
    user: 'Moohammad',
    password: 'oq14XwiHjk9TygJP',
    database: 'Moohammad',
    port: 16200
});

// connect to db
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database!');
});

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
}));

// settings
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



/****************************************************************/
app.get('/', getHomePage);



// listen to port
app.listen(port, () => {
    console.log(`Listening on ${port}!`); 
});