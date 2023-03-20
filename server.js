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


app.listen(port, function() {
    console.log('test');
});