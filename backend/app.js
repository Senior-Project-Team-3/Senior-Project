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

// app.get('/recipes/:recipe_name/search', function(req, res) {
//     var recipe_name = req.params.recipe_name;
//     console.log(req.params.recipe_name)
//     let sql = "SELECT * FROM recipe WHERE recipe_name = '" + recipe_name + "'";
//     let query = db.query(sql, (err, results) => {
//         if (err) {
//             throw err;
//         }
//         console.log(results);
//         res.send(results);
//     })
// })

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
    console.log(req.body.data);
    let results = JSON.parse(req.body.data);
    // console.log(results);
    // This is for initial survey so far...
    let vegetarian = results.vegetarian;
    let proteins = results.proteins;
    let cuisines = results.cuisines;
    let cookTime = results.cookTime;
    let appliances = results.appliances;
    let intolerant = results.intolerant;
    let intolerances = results.intolerances;
    console.log("Vegetarian?: " + vegetarian);
    console.log("Proteins: " + proteins);
    console.log("Cuisines: " + cuisines);
    console.log("Cook time: " + cookTime);
    console.log("Appliances: " + appliances);
    console.log("Intolerant?: " + intolerant);
    console.log("Intolerances: " + intolerances);
    let sql = "select name, minutes, recipes.recipe_id, imageLink, tags " +
        "from mealmateSQL.recipes " +
        "join mealmateSQL.steps on mealmateSQL.steps.recipe_id = mealmateSQL.recipes.recipe_id " +
        "join mealmateSQL.nutrition on mealmateSQL.nutrition.recipe_id = mealmateSQL.recipes.recipe_id where ";
    if (vegetarian == "Yes") {
        sql += "mealmateSQL.recipes.tags like \"%vegetarian%\" AND "
    }
    if (proteins !== null) {
        if (String(proteins) !== "No Preference") {
            let splitProteins = String(proteins).split(',');
            for (let i = 0; i < splitProteins.length; i++) {
                let element = splitProteins[i];
                // console.log(element);
                if (i == splitProteins.length - 1) {
                    sql += "mealmateSQL.recipes.ingredients like \"%" + element.toLowerCase() + "%\" AND "
                } else {
                    sql += "mealmateSQL.recipes.ingredients like \"%" + element.toLowerCase() + "%\" OR "
                }
            }
        }
    }
    if (String(cuisines) !== "No Preference") {
        let splitCuisines = String(cuisines).split(',');
        for (let i = 0; i < splitCuisines.length; i++) {
            let element = splitCuisines[i];
            // console.log(element);
            if (i == splitCuisines.length - 1) {
                sql += "mealmateSQL.recipes.tags like \"%" + element.toLowerCase() + "%\" AND "
            } else {
                sql += "mealmateSQL.recipes.tags like \"%" + element.toLowerCase() + "%\" OR "
            }
        }
    }
    if (cookTime !== "No Preference") {
        sql += "mealmateSQL.recipes.tags like \"%" + cookTime + "%\" AND ";
    }
    let splitAppliances = String(appliances).split(',');
    console.log(splitAppliances);
    if (splitAppliances.indexOf("Oven") < 0) {
        sql += "mealmateSQL.recipes.tags NOT like \"%oven%\" AND ";

    }
    if (splitAppliances.indexOf("Food Processor") < 0) {
        sql += "mealmateSQL.recipes.tags NOT like \"%food-processor-blender%\" AND ";

    }
    if (splitAppliances.indexOf("Microwave") < 0) {
        sql += "mealmateSQL.recipes.tags NOT like \"%microwave%\" AND ";

    }
    if (splitAppliances.indexOf("Stove") < 0) {
        sql += "mealmateSQL.recipes.tags NOT like \"%stove-top%\" AND ";

    }
    if (splitAppliances.indexOf("Grill") < 0) {
        sql += "mealmateSQL.recipes.tags NOT like \"%grilling%\" AND ";

    }
    if (splitAppliances.indexOf("Pressure Cooker") < 0) {
        sql += "mealmateSQL.recipes.tags NOT like \"%pressure-cooker%\" AND ";

    }
    if (splitAppliances.indexOf("Crock-Pot") < 0) {
        sql += "mealmateSQL.recipes.tags NOT like \"%crock-pot-slow-cooker%\" AND ";

    }
    if (intolerances !== null) {
        let splitIntolerances = String(intolerances).split(',');
        for (let i = 0; i < splitIntolerances.length; i++) {
            let element = splitIntolerances[i];
            console.log(element);
            if (i == splitIntolerances.length - 1) {
                sql += "mealmateSQL.recipes.ingredients NOT like \"%" + element.toLowerCase() + "%\" LIMIT 1;";
            } else {
                sql += "mealmateSQL.recipes.ingredients NOT like \"%" + element.toLowerCase() + "%\" AND "
            }
        }
    } else {
        var n = sql.lastIndexOf("AND");
        sql = sql.slice(0, n) + sql.slice(n).replace("AND", "LIMIT 1;");
    }
    console.log(sql);
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
        res.send(results);
    });
});

app.listen(3000, () => console.log("Server Connected on Port 3000"))