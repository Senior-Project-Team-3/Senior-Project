require('dotenv').config()
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { request } = require('express');
// used as a fail safe when creating a user
var userid = "shouild be overwritten";

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//const secret = "zWkh]M7J_?3F:@kXEr,)kKHk" // JWT secret key
const secret = process.env.ACCESS_TOKEN_SECRET

/**
 * Creates a new user in the mealmateSQL and sets the global variable userid 
 * to a unique id generated in the database.
 * 
 * @param {Number} userRecipeID the recipe id from the recipe that was recommended to the user. 
 */
createuser = function (userRecipeID) {
    sql1 = 'CALL createUser(' + userRecipeID + ')';
    db.query(sql1, (err, resultsForUser, fields) => {
        if (err) {
            throw err;
        }
        userid = JSON.stringify(resultsForUser[0][0]).split(':')[1].split('}')[0]
    });
}

/**  
 * Returns a jwt signed token that stores the clients user id.
 * 
 * @returns {jwtoken} a jwt signed token.
 */
createjwt = function () {
    return jwt.sign({ "userid": userid }, secret);
}

/**
 * Inserts the recommended recipe for the user into the mealmateSQL database.
 * 
 * @param {String} returningUserId the users id stored in the cookies.
 * @param {Number} userRecipeID tthe recipe id from the recipe that was recommended to the user. 
 */
insertUserReconnemdedRecipe = function (returningUserId, userRecipeID) {
    sql1 = 'CALL insertUserAndRecipe(' + returningUserId + ',' + userRecipeID + ');';
    db.query(sql1, (err, resultsForUser, fields) => {
        if (err) {
            throw err;
        }
    });
}

/**
 * Saves the user Preferences in the mealmateSQL database.
 * 
 * @param {String} userid the user id stored in the clients cookies 
 * @param {String} vegetarian the users answer to the vegeratian question from the survey
 * @param {Object} proteins An array of selected proteins by the user 
 * @param {Object} cuisines An array of selected cuisines by the user 
 * @param {String} cookTime the users answer to the cook time question from the survey
 * @param {Object} appliances An array of selected appliances by the user 
 * @param {String} intolerant the users answer to the intolerant question from the survey
 * @param {Object} intolerances An array of selected intolerances by the user 
 */
saveUserPreferences = function (userid, vegetarian, proteins, cuisines, cookTime, appliances, intolerant, intolerances) {

    if (intolerant === 'No') {
        intolerances = 'No'
    } else {
        intolerances = objToString(intolerances)
    }
    if (vegetarian === 'Yes') {
        proteins = 'No'
    } else {
        proteins = objToString(proteins)
    }
    cuisines = objToString(cuisines)
    appliances = objToString(appliances)

    setTimeout(() => {
        sql1 = "CALL saveUserPreferences(" + userid + ',' + JSON.stringify(vegetarian) + ',' + JSON.stringify(proteins) + ',' +
            JSON.stringify(cuisines) + ',"' + cookTime + '",' + JSON.stringify(appliances) + ',' + JSON.stringify(intolerant) + ',' +
            JSON.stringify(intolerances) + ")";
        db.query(sql1, (err, resultsForUser, fields) => {
            if (err) {
                throw err;
            }
        });

    }, 200)

}

/**
 * Updates a user's Preferences in the mealmateSQL database. 
 * 
 * @param {String} userIDCookies the user's id stored in the clients cookies
 * @param {Object} newCuisine An array that has the user's new prefered cusines   
 * @param {Object} newProtein An array that has the user's new prefered cusines  
 * @param {String} newCookTime the user's new prefered cook time
 */
updateUserPreferences = function (userIDCookies, newCuisine, newProtein, newCookTime) {
    newCuisine = objToString(newCuisine)
    newProtein = objToString(newProtein)
    setTimeout(() => {
        sql = "CALL updateUserPreferences(" + userIDCookies + ',' + JSON.stringify(newCuisine) + ',' +
            JSON.stringify(newProtein) + ',' + JSON.stringify(newCookTime) + ")";
        db.query(sql, (err, resultsForUser, fields) => {
            if (err) {
                throw err;
            }
            console.log("updatting user preferences")
        });

    }, 200)
}

/**
 * Saves a user review of a recipe that was previously recommended to them
 * 
 * @param {Number} reviewedRecipe_id the recipe id of the recommended recipe a user made a review of 
 * @param {Number} rating a number ranging from 1 to 5 that represents the users rating of a recipe 
 * @param {String} substitutes substitutes used when follwoing a recipe 
 * @param {String} improvement any extra ingreditnes. etc. used when following a recipe 
 * @param {String} recommend a reason why a user would recommened this recipe to their friend or not 
 */
saveUserRecipeReview = function (reviewedRecipe_id, userIDCookies, rating, substitutes, improvement, recommend, difficulty) {
    reviewString = ""
    reviewString += "I rated this recipe a " + rating + " out of 5. The recipe was " + difficulty + " to follow "
    if (recommend.includes('Yes')) {
        reviewString += " I would recommend this recipe to a friend"
    } else {
        reviewString += "I would not recommend this recipe to a friend"
    }
    if (substitutes) {
        reviewString += substitutes
    }
    if (improvement) {
        reviewString += improvement
    }

    todaysDate = getTodaysDateInCorrectFormat()

    setTimeout(() => {
        sql = "CALL saveUserReview(" + reviewedRecipe_id + ',' + userIDCookies + ',' + JSON.stringify(reviewString) + ',' +
            JSON.stringify(rating) + ',' + JSON.stringify(todaysDate) + ")";
        db.query(sql, (err, results) => {
            if (err) {
                throw err;
            }
        });
    }, 200)
}

/**
 * Turns an object into a string 
 * 
 * @param {Object} obj 
 * @returns {String} A string 
 */
function objToString(obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += ':' + obj[p];
        }
    }
    return str;
}

/**
 * this function gets the current date and formates it
 * to match the date formatting in the database
 * 
 * @returns {String} formatted date to match the database
 */
function getTodaysDateInCorrectFormat() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today
}

require('dotenv').config();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    //res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * The database inforamtion needed to create a connection
 * to the mysql database. for security reasons, the
 * informtaion is storeed in enviroment variables. 
 */
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
});

/**
 * this will try to connect to the databse,
 * if connected, log databse connected
 * else throw and error. 
 */
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Database Connected");
});

/* Used to clear all cookies created */
app.get('/clear', (req, res) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.clearCookie('refreshAccessToken')
    res.send('cookies cleared');
});

/**
 * This endpoint queries the recipes table in our database 
 * to search for recipes that match or contain the :recipe_name 
 * entered into the search bar. It sends recipe results back in JSON format.  
 * 
 * @returns {Response} send recipts results back in JSON format
 */
app.get('/recipes/search-results/:str', function (req, res) {
    var str = req.params.str;
    let sql = "SELECT * FROM recipes WHERE name LIKE '%" + str + "%'";
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    })
})

/**
 * This endpoint queries the reviews table in our database to search 
 * for 8 recipes whose ratings were above the average review rating. 
 * 
 * @returns {Response} send back the recipe's back in JSON format 
 */
app.get('/recipes/review/top_rated', function (req, res) {
    let sql = "call selectRandomRecipes();"
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

/**
 * This endpoint will grab all the necessary information about a recipe 
 * with the matching :recipe_id in the recipes table in our database. 
 * 
 * @returns {Response} recipe is sent back in JSON format 
 */
app.get('/recipe/:recipe_id', function (req, res) {
    var recipe_id = req.params.recipe_id;
    let sql = "SELECT * FROM recipes " +
        "INNER JOIN nutrition " +
        "ON recipes.recipe_id = nutrition.recipe_id " +
        "INNER JOIN steps " +
        "ON recipes.recipe_id = steps.recipe_id " +
        "WHERE recipes.recipe_id = " + recipe_id;
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    })
})

/**
 * Allows the user to view random recipes when they load the homepage
 * This endpoint queries the recipes table in our database to find 
 * :amount of random recipes. 
 * 
 * @returns {Response} sends the recipe's results back in JSON format. 
 */
app.get('/recipes/random/:amount', function (req, res) {
    var amount = req.params.amount;
    let sql = "SELECT * FROM recipes AS t1 " +
        "JOIN (SELECT recipe_id FROM recipes ORDER BY RAND() LIMIT " + amount + " ) as t2 " +
        "ON t1.recipe_id=t2.recipe_id;"
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

/**
 * Allows the user to view their recommended/saved recipes on their my recipes page. 
 * If the cookies are set, grab the user id from the cookies and query the database 
 * to grab their previously recommended recipes, and send the recipe's results back in JSON format. 
 * If cookies are not set, send back an empty array
 * 
 * @returns {Response} if cookies are set, send the recipe results back in JSON format
 */
app.get('/recipes/my_recipes', function (req, res) {
    if (req.cookies.jwtoken) { // jwtoken cookie is set
        try {
            decoded = jwt.verify(req.cookies.jwtoken, secret);
            var userID = decoded.userid;
            let sql = 'call selectRecipesRecommendedToUserByUserId(' + userID + ');'
            let query = db.query(sql, (err, results) => {
                if (err) {
                    throw err;
                }
                res.send(results);
            });
        } catch (err) {
            // bad token
            data = []
            // res.status(401).send("Invalid token")
            res.status(200).send(data);
        }
    } else {
        //cookies are not set and is a new user
        /** TO DO: tell them to take a survey  */
        data = []
        res.status(200).send(data);
    }
});

/**
 * Allows the user to be recommended recipes after taking the initial survey.
 * This endpoint will take the users answers to all the questions, 
 * query the recipes table in our database that matches the users responses 
 * and send the recipe's results back in JSON format.
 * 
 * @returns {Response} send the recipe's results back in JSON format.
 */
app.put('/survey_results/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    let results = JSON.parse(req.body.data);
    // This is for initial survey so far...
    let vegetarian = results.vegetarian;
    let proteins = results.proteins;
    let cuisines = results.cuisines;
    let cookTime = results.cookTime;
    let appliances = results.appliances;
    let intolerant = results.intolerant;
    let intolerances = results.intolerances;

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
        sql = sql.slice(0, n) + sql.slice(n).replace("AND", "LIMIT 5;");
    }
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

// v--- New work for multiple recommendations ---v

/**
 * After taking the initial survey, this allows a user to save recipes to their my_recipes page. 
 * If the cookies are set, grab the users Id and save the recipe in the recommend recipes table 
 * in our database. If cookies are not set; create a user, save the recipe in the recommended recipes 
 * table and set the cookies to hold a JWT that stores the user’s id. Send back a 200 status. 
 * 
 * @returns {Response} Send back a 200 status if no erros occur. 
 */
app.put('/survey_results/save/:recipe_id', function (req, res) {
    let results = JSON.parse(req.body.data);
    let vegetarian = results.vegetarian;
    let proteins = results.proteins;
    let cuisines = results.cuisines;
    let cookTime = results.cookTime;
    let appliances = results.appliances;
    let intolerant = results.intolerant;
    let intolerances = results.intolerances;
    // grab the recipe ID for the recipe from results and use that to create a user
    var userRecipeID = req.params.recipe_id;
    // used to know if the person taking the survey is a new user or a returning user.
    var returningUser = false;
    if (req.cookies.jwtoken) { // cookies are set. save recomeneded recipe in db  
        returningUser = true;
        decoded = jwt.verify(req.cookies.jwtoken, secret);
        var returnUserID = decoded.userid;
        userid = returnUserID;
        insertUserReconnemdedRecipe(returnUserID, userRecipeID)
    }
    if (!returningUser) { // cookies are not set 
        createuser(userRecipeID)
    }
    // used a timeout to ensure that the functions above run
    //before setting a coookie and sending the results(recommended recipe)
    setTimeout(() => {
        console.log(returningUser)
        if (!returningUser) { // will only set the cookies if its a new user taking the survey
            // cookie set to expire in a year 
            res.cookie('jwtoken', jwt.sign({ "userid": userid }, secret), { expires: new Date(Date.now() + 31556952000) })
            // save the users preferences in the database 
            saveUserPreferences(userid, vegetarian, proteins, cuisines, cookTime, appliances, intolerant, intolerances)
        }
        res.sendStatus(200);
    }, 200)

});

/**
 * Allows a user to review a recipe in their rmy_recipes page.
 * This endpoint will save their review of a recipe in our database, 
 * update the users preferences that are saved in our database, and query 
 * the recipes table for recipes that match the user preferences. 
 * The recipe's results are sent back in JSON format. 
 * 
 * @returns {Response} recipe's results are sent back in JSON format.
 */
app.put('/review_results/:recipe_id', function (req, res) {
    var reviewedRecipe_id = req.params.recipe_id
    let results = JSON.parse(req.body.data)
    decoded = jwt.verify(req.cookies.jwtoken, secret);
    var userIDCookies = decoded.userid;
    let rating = results.rating
    let realCookTime = results.realCookTime
    let substitutes = results.substitutes
    let prefMatch = results.prefMatch
    let difficulty = results.difficulty
    let improvement = results.improvement
    let recommend = results.recommend
    let prefChange = results.prefChange
    let newProtein = results.newProtien
    let newCuisine = results.newCuisine
    let newCookTime = results.newCookTime

    if (prefChange === 'Yes') {
        updateUserPreferences(userIDCookies, newCuisine, newProtein, newCookTime);
    }
    saveUserRecipeReview(reviewedRecipe_id, userIDCookies, rating, substitutes, improvement, recommend, difficulty)
    setTimeout(() => {
        let selectUserPreferencesQuery = 'call selectUserPreferences(' + userIDCookies + ');'
        let selectQuery = db.query(selectUserPreferencesQuery, (err, UserResults) => {
            if (err) {
                throw err;
            }
            var areYouAVegertarian = UserResults[0][0].answer_text
            var mainSourceOfMeat = UserResults[0][1].answer_text
            var cuisines = UserResults[0][2].answer_text
            var lengthOfCooking = UserResults[0][3].answer_text
            var appliances = UserResults[0][4].answer_text
            var haveAllergyOrIntolerances = UserResults[0][5].answer_text
            var selectedAllergiesOrIntolerances = UserResults[0][6].answer_text

            let recommendSQL = "select name, minutes, recipes.recipe_id, imageLink, tags " +
                "from mealmateSQL.recipes " +
                "join mealmateSQL.steps on mealmateSQL.steps.recipe_id = mealmateSQL.recipes.recipe_id " +
                "join mealmateSQL.nutrition on mealmateSQL.nutrition.recipe_id = mealmateSQL.recipes.recipe_id where ";

            if (areYouAVegertarian == "Yes") {
                recommendSQL += "mealmateSQL.recipes.tags like \"%vegetarian%\" AND "
            } else {
                if ((!mainSourceOfMeat.includes("No Preference")) && (!mainSourceOfMeat.includes("No"))) {
                    proteinsArray = mainSourceOfMeat.split(':')
                    for (let i = 0; i < proteinsArray.length; i++) {
                        let protein = proteinsArray[i]
                        if (!(protein === "")) {
                            if (i == proteinsArray.length - 1) {
                                recommendSQL += "mealmateSQL.recipes.tags like \"%" + protein.toLowerCase() + "%\" AND "
                            } else {
                                recommendSQL += "mealmateSQL.recipes.tags like \"%" + protein.toLowerCase() + "%\" OR "
                            }
                        }
                    }
                }
            }

            if ((!cuisines.includes("No Preference")) && (!cuisines.includes("No"))) {
                cuisinesArray = cuisines.split(':')
                for (let i = 0; i < cuisinesArray.length; i++) {
                    let cusine = cuisinesArray[i]
                    if (!(cusine === "")) {
                        if (i == cuisinesArray.length - 1) {
                            recommendSQL += "mealmateSQL.recipes.tags like \"%" + cusine.toLowerCase() + "%\" AND "
                        } else {
                            recommendSQL += "mealmateSQL.recipes.tags like \"%" + cusine.toLowerCase() + "%\" OR "
                        }
                    }
                }
            }

            if ((!lengthOfCooking.includes("No Preference")) && (!lengthOfCooking.includes("No"))) {
                recommendSQL += "mealmateSQL.recipes.tags like \"%" + lengthOfCooking + "%\" AND "
            }

            appliancesArray = appliances.split(":")
            for (let i = 0; i < appliancesArray.length; i++) {
                let appliance = appliancesArray[i]
                if (!(appliance === "")) {
                    if (i == appliancesArray.length - 1) {
                        recommendSQL += "mealmateSQL.recipes.tags like \"%" + appliance.toLowerCase() + "%\" AND "
                    } else {
                        recommendSQL += "mealmateSQL.recipes.tags like \"%" + appliance.toLowerCase() + "%\" OR "
                    }
                }
            }

            if ((!haveAllergyOrIntolerances.includes("No Preference")) && (!haveAllergyOrIntolerances.includes("No"))) {
                selectedAllergiesOrIntolerancesArray = selectedAllergiesOrIntolerances.split(":")
                for (let i = 0; i < selectedAllergiesOrIntolerancesArray.length; i++) {
                    let allergy = selectedAllergiesOrIntolerancesArray[i]
                    if (!(allergy === "")) {
                        if (i == selectedAllergiesOrIntolerancesArray.length - 1) {
                            recommendSQL += "mealmateSQL.recipes.tags NOT like \"%" + allergy.toLowerCase() + "%\" LIMIT 10; "
                        } else {
                            recommendSQL += "mealmateSQL.recipes.tags  NOT like \"%" + allergy.toLowerCase() + "%\" AND "
                        }
                    }
                }
            } else {
                var n = recommendSQL.lastIndexOf("AND");
                recommendSQL = recommendSQL.slice(0, n) + recommendSQL.slice(n).replace("AND", "LIMIT 10;");
            }

            setTimeout(() => {
                console.log(recommendSQL)
                db.query(recommendSQL, (err, recResults) => {
                    if (err) {
                        throw err;
                    }
                    res.send(recResults)
                })
            }, 400)

        })
    }, 300)
});

/**
 * This endpoint will select the users most recent saved/recommended recipe.
 * The recipe is sent back in JSON format. 
 * 
 * @returns {Response} if cookies are set, uesers most recent recipe is sent back in JSON format. 
 */
app.put('/review/user/recent', function (req, res) {
    if (req.cookies.jwtoken) { // jwtoken cookie is set
        try {
            decoded = jwt.verify(req.cookies.jwtoken, secret);
            var userID = decoded.userid;
            let sql = 'call selectRecentRecipeForGivenUserID(' + userID + ');'
            let query = db.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                res.send(results);
            });
        } catch (err) {
            // bad token
            data = []
            // res.status(401).send("Invalid token")
            res.status(200).send(data);
        }
    } else {
        //cookies are not set and is a new user
        data = []
        res.status(200).send(data);
    }
});

/**
 * This endpoint will delete a recipe from the users my recipes page
 * and remove the recipe from the recommened recipes table in
 * our database
 * 
 * @returns {Response} sends back sql packet message that notifes the frontend if 
 *                     the row was affected or not 
 */
app.delete('/recipes/my_recipes/:recipe_id', function (req, res) {
    let recipeID = req.params.recipe_id;
    decoded = jwt.verify(req.cookies.jwtoken, secret);
    var userID = decoded.userid;
    sql = 'CALL deleteUserRecipe(' + userID + ', ' + recipeID + ')';
    db.query(sql, (err, results) => {
        if (err) {
            res.send("404");
            throw err;
        }
        res.send(results);

    })
});

app.listen(3000, () => console.log("Server Connected on Port 3000"))