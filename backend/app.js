const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Database Connected");
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/recipes/:recipe_name/search', function(req, res) {
    var recipe_name = req.params.recipe_name;
    console.log(req.params.recipe_name)
    let sql = "SELECT * FROM recipe WHERE recipe_name = '" + recipe_name + "'";
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
        res.send(results);
    })
})

app.get('/recipes/review/top_rated', function(req, res) {
    let sql = "select * from recipes " +
        "INNER JOIN nutrition " +
        "ON recipes.recipe_id = nutrition.recipe_id " +
        "INNER JOIN steps " +
        "ON recipes.recipe_id = steps.recipe_id " +
        "limit 8;"
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
        res.send(results);
    });
});

app.get('/recipes/random/:amount', function(req, res) {
    var amount = req.params.amount;
    let sql = "SELECT * FROM recipes AS t1 " +
        "JOIN (SELECT recipe_id FROM recipes ORDER BY RAND() LIMIT " + amount + " ) as t2 " +
        "ON t1.recipe_id=t2.recipe_id " +
        "INNER JOIN nutrition " +
        "ON t1.recipe_id = nutrition.recipe_id " +
        "INNER JOIN steps " +
        "ON t1.recipe_id = steps.recipe_id;"
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
        res.send(results);
    });
});

app.put('/survey_results/:user_id', function(req, res) {
    var user_id = req.params.user_id;
    console.log(req.params)
    res.send("DS");
});

app.listen(3000, () => console.log("Server Connected on Port 3000"))