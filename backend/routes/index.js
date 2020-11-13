const express = require('express');
const mysql = require('mysql');
const router = express.Router();

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

router.get('/recipes/:recipe_name/search', function(req, res) {
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

router.get('/recipes/review/top_rated', function(req, res) {
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

router.get('/recipes/random/:amount', function(req, res) {
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

module.exports = router;