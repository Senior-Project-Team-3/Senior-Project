require('dotenv').config()

const express = require('express');
const mysql = require('mysql');

const index = require('./routes/index');
const app = express();

const jwt = require('jsonwebtoken');
const { post } = require('./routes/index');

app.use(express.json())

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

app.get('/posts', authenticateToken, (req, res) => {
    //res.json(posts)
    res.json(posts.filter(post => post.username === req.user.name)) //only returning the posts the user has access to
})

app.post('/login', (req, res) =>{
    // Authenticate user goes here
    
    const username = req.body.username
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})

function authenticateToken(req, res, next)
{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //Bearer portion of the token and returns undefined if no token found
    if (token == null) return res.sendStatus(401) //Outputing 401 Error to user

    //verifying token with callback functionality
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user) => {
        if (err) return sendStatus(403) //notifies user that the token is no longer valid
        req.user = user //setting the valid user token
        next()
    })
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