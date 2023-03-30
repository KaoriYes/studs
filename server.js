const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const port = 1337;

app.use(express.static('static'));
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.set('view engine', 'ejs');


//database verbinden
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const password = process.env.PASSWORD;
const uri = "mongodb+srv://adminuser:" + password + "@studsdb.8yrtlny.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//vakken datsase
const databaseVakken = client.db("studsdb");
const collectionVakken = databaseVakken.collection("col_vakken");

const databaseUsers = client.db("studsdb");
const collectionUsers = databaseUsers.collection("col_users");


app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs', {title: 'Home'});
});

app.get('/preRegister', (req, res) => {
    res.render('preRegister.ejs', {title: 'Register'});
});
app.get('/registerQuestion', (req, res) => {
    res.render('registerQuestion.ejs', {title: 'Register'});
});


app.get('/studentRegister', (req, res) => {
    res.render('studentRegistrer.ejs', {title: 'Student Register', subtitle: ''});
});
app.get('/saRegister', (req, res) => {
res.render('saRegister', {title: 'Student Assistent Register', subtitle: ''});
});
app.post('/studentRegister', async (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = req.body.password;
  const secondpassword = req.body.confirm_password;
  const leerjaar = req.body.leerjaar;
  if (password !== secondpassword) {
    res.locals.subtitle = 'Password does NOT match';
    res.render('studentRegister.ejs');
  } else {
    // res.render('submitted.ejs'); // Qt: this is for later..
    const hashedpw = await bcrypt.hash(password, saltRounds);
    var userdata = {
      name,
      surname,
      hashedpw,
      email,
      leerjaar
      // no need for : value if key and value are the same
    };
    collectionUsers.insertOne(userdata, function (err, collection) {
      if (err) throw err;
      res.redirect('/');
      console.log('Record inserted Successfully');
    });
  }
});

app.post('/submit-sa', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const secondpassword = req.body.confirm_password;
  const leerjaar = req.body.leerjaar;
  const richting = req.body.richting;
  if (password !== secondpassword) {
    res.locals.subtitle = 'Password does NOT match';
    res.render('student_register.ejs');
  } else {
    // res.render('submitted.ejs'); // Qt: this is for later..
    const hashedpw = await bcrypt.hash(password, saltRounds);
    var userdata = {
      name,
      hashedpw,
      email,
      leerjaar,
      richting
      // no need for : value if key and value are the same
    };
    collectionUsers.insertOne(userdata, function (err, collection) {
      if (err) throw err;
      console.log('Record inserted Successfully');
    });
  }
});



app.listen(port, function() {
  collectionVakken.find({}).toArray().then((vakken) => {
        const vaknamen = vakken.map((vak) => vak.naam);
        console.log(vaknamen);
    });
});