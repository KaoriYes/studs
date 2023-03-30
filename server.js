const express = require('express');
const app = express();
const port = 1600;
const ejs = require('ejs');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use('/public/', express.static('./public'));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//Dit is voor de form

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//database verbinden
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const password = process.env.PASSWORD;
const uri = "mongodb+srv://adminuser:" + password + "@studsdb.8yrtlny.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//vakken datsase
const databaseVakken = client.db("studsdb");
const collectionVakken = databaseVakken.collection("col_vakken");


//homepage
app.get('/', (req, res) => {
    res.render('filter.ejs');
  });
  
  app.get("/filter", (req, res) => {
    collectionVakken.find({}).toArray().then((vakken, jaar) => {
        const vaknamen = vakken.map((vak) => vak.naam);
        res.render("filter.ejs", { vakken: vaknamen, jaar });
    });
  });
  
  app.post("/filter", (req, res) => {
    const selectedJaar = req.body.jaar;
    collectionVakken.find({ jaar: selectedJaar }).toArray().then((vakken) => {
      const vaknamen = vakken.map((vak) => vak.naam); // Extract name field
      res.render("filter.ejs", { vakken: vaknamen });
    });
  });
  


app.listen(port, function() {
    console.log('test');
});