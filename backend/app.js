require('dotenv').config()
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { request } = require('express');
var userid = "shouild be overwritten";

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:4200', //need to update to production url
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//const secret = "zWkh]M7J_?3F:@kXEr,)kKHk" // JWT secret key
const secret = process.env.ACCESS_TOKEN_SECRET

createuser = function(userRecipeID) {
    sql1 = 'CALL createUser(' + userRecipeID + ')';
    db.query(sql1, (err, resultsForUser, fields) => {
        if (err) {
            throw err;
        }
        console.log(userid)
        userid = JSON.stringify(resultsForUser[0][0]).split(':')[1].split('}')[0]
        console.log("Writing survey data into database and creating a user")
    });
}

createjwt = function() {
    console.log(userid)
    return jwt.sign({ "userid": userid }, secret);
}

insertUserReconnemdedRecipe = function(returningUserId, userRecipeID) {
    sql1 = 'CALL insertUserAndRecipe(' + returningUserId + ',' + userRecipeID + ');';
    db.query(sql1, (err, resultsForUser, fields) => {
        if (err) {
            throw err;
        }

        console.log("Writing recipe data for returning user in db")
    });
}

saveUserPreferences = function(userid, vegetarian, proteins, cuisines, cookTime, appliances, intolerant, intolerances) {
    /**user id */
    console.log("User: " + userid);
    /**queston ID: 1 */
    console.log("Vegetarian?: " + vegetarian); // can be yes or no 
    /**queston ID: 2 */
    console.log("Proteins: " + proteins); //list of proteins , could be null 
    /**queston ID: 3 */
    console.log("Cuisines: " + cuisines); //list of cusines
    /**queston ID: 4 */
    console.log("Cook time: " + cookTime);
    /**queston ID: 5 */
    console.log("Appliances: " + appliances); // list of appliances
    /**queston ID: 6 */
    console.log("Intolerant?: " + intolerant); // yes or no
    /**queston ID: 7 */
    console.log("Intolerances: " + intolerances); // if intolreant is yes, list of inrolerances
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
        console.log(sql1)
        db.query(sql1, (err, resultsForUser, fields) => {
            if (err) {
                throw err;
            }
            console.log("Writing user preferences data for user in db")
        });

    }, 200)

}

function objToString(obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += ':' + obj[p];
        }
    }
    return str;
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    //res.header("Access-Control-Allow-Origin", "*");
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


/* Later task: store refresh token(s) in database or redis cache */
let refreshTokens = []

/* data structure refreshTokens[] is drawing from */
const posts = [{
        username: 'Kyle'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    }
]

/* This GET request is retrieves user data only mataching the authentication */
app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name)) /* Only returning the posts the user has access to */
})

/* This POST request recieves the refresh JWT and creates time-based access tokens*/
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.token /* Looks the body of the JWT refresh token */
    if (refreshToken == null) return res.sendStatus(401) /* checking if token not null */
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) /* checking if the JWT refresh token exists in the storage */
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name }) /* Generating new access token */
            //res.json({ accessToken: accessToken })  /* Output JWT access token information */
        res.cookie('refreshAccessToken', accessToken, {
            //expires: new Date(Date.now() + expiration),
            //maxAge: 365 * 24 * 60 * 60 * 100, //max age of a year
            secure: false, // set to true if your using https
            httpOnly: true,
        }).send('Refresh Success!');
    })

})

/* Used to view all cookies created */
app.get('/', (req, res) => {
    res.send(req.cookies)

    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
})

/* Used to clear all cookies created */
app.get('/clear', (req, res) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.clearCookie('refreshAccessToken')
    res.send('cookies cleared');
});

/* Working version of app.post('/login') */
app.post('/survey', (req, res) => {
    const username = req.body.username
    const user = { name: username } /* Passing the body of the token as the user*/

    const accessToken = generateAccessToken(user) /* Creating time-based user access token */
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) /* Created a signed refresh JWT */
    refreshTokens.push(refreshToken) /* Adding the refresh JWT to the refreshTokens array */
        //res.json({ accessToken: accessToken, refreshToken: refreshToken}) /* Passing access and refresh JWT */
    res.cookie('accessTokenCookie', accessToken, {
        //expires: new Date(Date.now() + expiration),
        //maxAge: 365 * 24 * 60 * 60 * 100, //max age of a year
        secure: false, // set to true if your using https
        httpOnly: true,
    })
    res.cookie('refreshTokenCookie', refreshToken, {
        //expires: new Date(Date.now() + expiration),
        //maxAge: 365 * 24 * 60 * 60 * 100, //max age of a year
        secure: false, // set to true if your using https
        httpOnly: true,
    })
    res.send('Success!');
})

app.use('/testing', (req, res) => {
    const cookieToken = req.cookies.accessTokenCookie

    res.status(200).json(posts)
})


/* This DELETE is used to stop the JWT refresh token from creating addition time-based access JWT */
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token) /* Comparing body token for possible removal */
    res.sendStatus(204)
})

/* This function is used to authenticate the JWT as a non-null and verified */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] /* Bearer portion of the token and returns undefined if no token found */
    if (token == null) return res.sendStatus(401) /* Outputing 401 Error to user when token is null */

    /* verifying the JWT with callback functionality */
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403) /* notifies user that the token is no longer valid */
        req.user = user /* setting the valid user token */
        next()
    })
}

/* This function is used to generate the time-based access tokens */
function generateAccessToken(user) {
    ///return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s'})
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

}


/*
app.use('/home', (req, res) => {
    var cookie = getcookie(req);
    console.log(cookie);
});

function getcookie(req) {
    var cookie = req.headers.cookie;
    //user=someone; session=QyhYzXhkTZawIb5qSl3KKyPVN //(this is my cookie i get)
    return cookie.split('; ');
}
*/


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

app.get('/recipes/:user_id/my_recipes', function(req, res) {
    console.log(req.cookies)
    if (req.cookies.jwtoken) { // jwtoken cookie is set
        try {
            decoded = jwt.verify(req.cookies.jwtoken, secret);
            var userID = decoded.userid;
            let sql = 'call selectRecipesRecommendedToUserByUserId(' + userID + ');'
            let query = db.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(results);
                res.send(results);
            });
        } catch (err) {
            // bad token
            console.log("Invalid token")
                // res.status(401).send("Invalid token")
            res.status(200).send("\n\nGeneric recipes\n\n");
        }
    } else {
        //cookies are not set and is a new user
        /** TO DO: tell them to take a survey  */
        res.status(200).send("\n\nGeneric recipes\n\n");
    }
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
        console.log(results)
            // grab the recipe ID for the recipe from results and use that to create a user
        var userRecipeID = results[0]['recipe_id']
            // used to know if the person taking the survey is a new user or a returning user.
        var returningUser = false;
        if (req.cookies.jwtoken) { // cookies are set. save recomeneded recipe in db  
            returningUser = true;
            decoded = jwt.verify(req.cookies.jwtoken, secret);
            var returnUserID = decoded.userid;
            userid = returnUserID;
            insertUserReconnemdedRecipe(returnUserID, userRecipeID)
            console.log('cookies are set. this is a returning user')
        }
        if (!returningUser) { // cookies are not set 
            createuser(userRecipeID)
            console.log('cookeis are not set. creating a new user in the db')
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
            res.send(results);
        }, 200)
    });
});

app.put('/review_results/:userID', function(req, res) {
    console.log('entering the results endpoint')
    var user_id = req.params.user_id
    console.log(req.body.data)
    let results = JSON.parse(req.body.data)

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

    // let rating = results.rating
    // let realCookTime = results.realCookTime
    // let substitutes = results.substitutes
    // let prefMatch = results.prefMatch
    // let difficulty = results.difficulty
    // let improvement = results.improvement
    // let recommend = results.recommend
    // let prefChange = results.prefChange
    // let newCuisine = results.newCuisine
    // let newCookTime = results.newCookTime

    // console.log("Rating: " + rating)
    // console.log("Real Cook Time: " + realCookTime)
    // console.log("Substitutes: " + substitutes)
    // console.log("Preferences Match: " + prefMatch)
    // console.log("Difficulty: " + difficulty)
    // console.log("Improvement: " + improvement)
    // console.log("Recommend: " + recommend)
    // console.log("Preference Change: " + prefChange)
    // console.log("New Cuisine: " + newCuisine)
    // console.log("New Cook Time: " + newCookTime)

    // let sql = "select name, minutes, recipes.recipe_id, imageLink, tags " +
    //     "from mealmateSQL.recipes " +
    //     "join mealmateSQL.steps on mealmateSQL.steps.recipe_id = mealmateSQL.recipes.recipe_id " +
    //     "join mealmateSQL.nutrition on mealmateSQL.nutrition.recipe_id = mealmateSQL.recipes.recipe_id where ";
    
    // sql += "mealmateSQL.recipes.tags like \"%" + rating + "%\" AND "
    // sql += "mealmateSQL.recipes.tags like \"%" + realCookTime + "%\" AND "
    // sql += "mealmateSQL.recipes.tags like \"%" + substitutes + "%\" AND "
    // sql += "mealmateSQL.recipes.tags like \"%" + prefMatch + "%\" AND "
    // sql += "mealmateSQL.recipes.tags like \"%" + difficulty + "%\" AND "
    // sql += "mealmateSQL.recipes.tags like \"%" + improvement + "%\" AND "
    // sql += "mealmateSQL.recipes.tags like \"%" + recommend + "%\" AND "
    // sql += "mealmateSQL.recipes.tags like \"%" + prefChange + "%\" AND "
    // if (String(newCuisine) !== "No Preference") {
    //     let splitCuisines = String(newCuisine).split(',');
    //     for (let i = 0; i < splitCuisines.length; i++) {
    //         let element = splitCuisines[i];
    //         // console.log(element);
    //         if (i == splitCuisines.length - 1) {
    //             sql += "mealmateSQL.recipes.tags like \"%" + element.toLowerCase() + "%\" AND "
    //         } else {
    //             sql += "mealmateSQL.recipes.tags like \"%" + element.toLowerCase() + "%\" OR "
    //         }
    //     }
    // }
    // sql += "mealmateSQL.recipes.tags like \"%" + newCookTime

    // console.log(sql);
    // let query = db.query(sql, (err, results) => {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log(results)
    //         // grab the recipe ID for the recipe from results and use that to create a user
    //     var userRecipeID = results[0]['recipe_id']
    //         // used to know if the person taking the survey is a new user or a returning user.
    //     var returningUser = false;
    //     console.log('checking for cookie')
    //     if (req.cookies.jwtoken) { // cookies are set. save recomeneded recipe in db  
    //         console.log('reading in cookie')
    //         returningUser = true;
    //         decoded = jwt.verify(req.cookies.jwtoken, secret);
    //         var returnUserID = decoded.userid;
    //         userid = returnUserID;
    //         insertUserReconnemdedRecipe(returnUserID, userRecipeID)
    //         console.log('cookies are set. this is a returning user')
    //     }
    //     if (!returningUser) { // cookies are not set 
    //         createuser(userRecipeID)
    //         console.log('cookeis are not set. creating a new user in the db')
    //     }
    //     // used a timeout to ensure that the functions above run
    //     //before setting a coookie and sending the results(recommended recipe)
    //     setTimeout(() => {
    //         console.log(returningUser)
    //         if (!returningUser) { // will only set the cookies if its a new user taking the survey
    //             // cookie set to expire in a year 
    //             res.cookie('jwtoken', jwt.sign({ "userid": userid }, secret), { expires: new Date(Date.now() + 31556952000) })
    //                 // save the users preferences in the database 
    //             saveUserPreferences(userid, newCuisine, newCookTime)
    //         }
    //         res.send(results);
    //     }, 200)
   // });
});

app.put('/review/user/recent', function(req,res) {
    console.log(req.cookies)
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
                console.log(results);
                res.send(results);
            });
        } catch (err) {
            // bad token
            console.log("Invalid token")
                // res.status(401).send("Invalid token")
            res.status(200).send("\n\nGeneric recipes\n\n");
        }
    } else {
        //cookies are not set and is a new user
        /** TO DO: tell them to take a survey  */
        res.status(200).send("\n\nGeneric recipes\n\n");
    }
});

app.listen(3000, () => console.log("Server Connected on Port 3000"))