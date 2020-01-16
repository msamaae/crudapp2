// check if we're running in production enviroment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};

// modules
const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 16200;
let users = [];

/* ***************************************************************************************************************** */
const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const { getHomePage, 
        getAddPage, 
        addRestaurant, 
        getEditPage, 
        updateRestaurant, 
        deleteRestaurant, 
        getReviewPage,
        addReview 
} = require('./routes/restaurant');

// create connection to db
const db = mysql.createConnection({
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
    getUsers();
});
// so that we can use db variable globally
global.db = db;

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
}));
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// settings
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/* ***************************************************************************************************************** */
app.get('/', checkAuthenticated, (req, res) => {
        res.render('index', {
            name: req.user.name
        });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});

app.post('/login', checkNotAuthenticated ,passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        let userEmail = req.body.email;
        let userName = req.body.name;
        let userPassword = hashedPassword;

        // send the review's details to the database
        let query = "INSERT INTO users (user_name, user_email, user_password) VALUES ('" +
            userName + "', '" + userEmail + "', '" + userPassword + "')";
        
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            getUsers();
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

// routes
app.get('/restaurant', checkAuthenticated, getHomePage);

app.get('/restaurant/add', checkAuthenticated, getAddPage);
app.post('/restaurant/add', checkAuthenticated, addRestaurant);

app.get('/restaurant/edit/:id', checkAuthenticated, getEditPage);
app.post('/restaurant/edit/:id', checkAuthenticated, updateRestaurant);

app.get('/restaurant/delete/:id', checkAuthenticated, deleteRestaurant);

app.get('/restaurant/review/:id', checkAuthenticated, getReviewPage);
app.post('/restaurant/review/:id', checkAuthenticated, addReview);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};



function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
};

function getUsers() {
    let query = 'SELECT * FROM users';

    db.query(query, (err, result) => {
        if (err) throw err;
        users = [];
        result.forEach(user => {
            let newUser = {
                id: user.user_id,
                email: user.user_email,
                name: user.user_name,
                password: user.user_password
            }
            users.push(newUser);
             console.log(newUser);
        });
    });
};

// listen to port
app.listen(port, () => {
    console.log(`Listening on ${port}!`); 
});