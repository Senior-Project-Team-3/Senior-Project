const express = require('express');
const mysql = require('mysql');
const router = express.Router();

/**
 * Configure thise section for your local DB
 */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'db'
})

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
    let sql = "select * from recipes INNER JOIN nutrition ON recipes.recipe_id = nutrition.recipe_id INNER JOIN steps ON recipes.recipe_id = steps.recipe_id limit 1;"
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
        res.send(results);
    });
});

module.exports = router;