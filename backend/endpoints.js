const fetch = require('node-fetch');
const express = require('express')
const app = express()
const port = 3000
var mysql = require('mysql');
const { response } = require('express');
var API_Key = '2eed5d2ac06949a995e590b06632ad46';

// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Unxhemd8',
//     database: 'recipeinfodb',
// });

// //a simple endpoint to check connection and return all the tables in the database
// app.get("/db", (req, res) => {
//     connection.connect(connection, function (err) {
//         if (err) console.log(err);
//         connection.query('show tables', function(err, result) {
//             if (err) console.log(err)
//             res.send(result);
//         });
//     });
// });

/* makes a API request to spoonaculars api. This endpoint requests subsituites for a given 
ingredient. Spooonaculars api Responseds with the substitutes. Returns in JSON format */
app.get('/Substitute/:ingredient', (request, response) => {
    const ingredient = request.params.ingredient;
    var url = `https://api.spoonacular.com/food/ingredients/substitutes?ingredientName=${ingredient}&apiKey=${API_Key}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            /* var text = '';
            for (var key in data){
                if(key == 'substitutes'){
                    text += data[key]
                }
            } */
            response.send({ data });
        })
        .catch(err => {
            response.send(err)
        })
})

/* makes a API request to spoonaculars api. This endpoint requests a raondom recipe.
 Spoonacularsa api responds with a random recipe. Returns in JSON format */
app.get('/randomRecipe/random', (request, response) => {
    var url = 'https://api.spoonacular.com/recipes/random?number=1&apiKey=2eed5d2ac06949a995e590b06632ad46';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            response.send({ data });
        })
        .catch(err => {
            response.send(err)
        })
})

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
