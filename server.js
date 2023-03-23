const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const port = 1337;


app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('test');
});

//database
const { MongoClient, ServerApiVersion } = require('mongodb');

//password in env
require('dotenv').config();
const password = process.env.PASSWORD;

//url om te verbinden
const uri = "mongodb+srv://adminuser:" + password + "@studsdb.8yrtlny.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//col voor de studenten
const database = client.db("studsdb");
const collection = database.collection("col_studs");

//col voor thema
const database = client.db("studsdb");
const collection = database.collection("col_thema");

//col voor de users
const database = client.db("studsdb");
const collection = database.collection("col_users");



app.listen(port, function() {
    console.log('test');
});