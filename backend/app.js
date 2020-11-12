require('dotenv').config() /* Used to access the .env file, which stores the secrets*/

const express = require('express');
const mysql = require('mysql');

const index = require('./routes/index');
const app = express();

const jwt = require('jsonwebtoken');
const { post } = require('./routes/index');
const { request } = require('express');

app.use(express.json())

/* User table to test functionality */
const posts = [
    {
        username: 'Kyle',
        title: 'Post 1'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    }
]

/* Later task: store refresh token(s) in database or redis cache */
let refreshTokens = []

/* This GET request is retrieves user data only mataching the authentication */
app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name)) /* Only returning the posts the user has access to */
})

/* This POST request recieves the refresh JWT and creates time-based access tokens*/
app.post('/token', (req,res) =>{
    const refreshToken = req.body.token /* Looks the body of the JWT refresh token */
    if(refreshToken == null) return res.sendStatus(401) /* checking if token not null */
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) /* checking if the JWT refresh token exists in the storage */
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name }) /* Generating new access token */
        res.json({ accessToken: accessToken })  /* Output JWT access token information */  
    })

})

/* This DELETE is used to stop the JWT refresh token from creating addition time-based access JWT */
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token) /* Comparing body token for possible removal */
    res.sendStatus(204)
})

/* This POST is used to generate an initial access JWT */
app.post('/login', (req, res) => {
    /* User Authentication Method goes here */
    
    const username = req.body.username
    const user = { name: username } /* Passing the body of the token as the user*/ 

    const accessToken  = generateAccessToken(user) /* Creating time-based user access token */
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) /* Created a signed refresh JWT */
    refreshTokens.push(refreshToken) /* Adding the refresh JWT to the refreshTokens array */
    res.json({ accessToken: accessToken, refreshToken: refreshToken}) /* Passing access and refresh JWT */
})

/* This function is used to authenticate the JWT as a non-null and verified */
function authenticateToken(req, res, next)
{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] /* Bearer portion of the token and returns undefined if no token found */
    if (token == null) return res.sendStatus(401) /* Outputing 401 Error to user when token is null */

    /* verifying the JWT with callback functionality */
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user) => {
        if (err) return res.sendStatus(403) /* notifies user that the token is no longer valid */
        req.user = user                     /* setting the valid user token */
        next()
    })
}

/* This function is used to generate the time-based access tokens */
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

app.post((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', index);
app.use(express.json());
app.listen(3000)//, () => console.log("Server Connected on Port 3000"))