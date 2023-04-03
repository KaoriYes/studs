const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({path: '.env'});
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { MongoClient, ObjectId } = require('mongodb');
const methodOverride = require('method-override');
const fetch = require('node-fetch');


// Set up middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/public/', express.static('./public'));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

// In-memory store for themes
let col_thema = [];
let randomQuote;

col_thema.forEach(theme => {
  console.log(theme);
});


let collection;

const password = process.env.PASSWORD;
const uri = "mongodb+srv://adminuser:" + password + "@studsdb.8yrtlny.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the database and set up the collection
async function connectToDatabase() {
  try {
    await client.connect();
    collection = client.db("studsdb").collection("col_thema");
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

connectToDatabase();

// Insert a new theme into the database
async function insertTheme(theme) {
  try {
    const result = await collection.insertOne(theme);
    console.log('Theme saved to database:', theme);
    col_thema.push(theme);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}



app.post('/submit-form', upload.single('image'), async (req, res) => {
  console.log('Your coven theme has been uploaded, huzzah!')
  console.log(req.file)
  const { body, file } = req;
  const theme = {
    _id: body.id,
    name: body.name, 
    backgroundColor: body.color,
    fontFamily: body.font,
    textColor: body['font-color'],
    images:  file.filename,
    thumbnailUrl: `/public/uploads/${file.filename}`
  };
  
  try {
    await insertTheme(theme);
    try {
      const renderData = await collection.find({}).toArray();
      res.render('theme-builder2', { col_thema: renderData , theme, randomQuote });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to retrieve themes');
    }
  } catch (err) {
    res.status(500).send({ error: 'Failed to save theme' });
  }
});

app.get('/thema-aanpassen', async (req, res) => {
  if (!collection) {
    return res.status(500).send('Unable to connect to database');
  }
  
  try {
    const renderData = await collection.find({}).toArray();
    res.render('theme-builder', { col_thema: renderData });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to retrieve themes');
  }
});

app.get('/col_thema/:themeID', async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send('Unable to connect to database');
    }

    const response = await fetch('https://opensheet.elk.sh/1er1dtNi_p5eKmqi70bGZLywuDzyce32JqzrywE57gU8/Blad1')
    const quotes = await response.json();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)].texts;

    const id = req.params.themeID;
    const theme = await collection.findOne({ _id: new ObjectId(id) });

    const renderData = await collection.find({}).toArray();
    res.render('theme-builder2', { col_thema: renderData, theme, randomQuote });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to retrieve theme');
  }
});



app.delete('/col_thema/:themeID', async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send('Unable to connect to database');
    }

    const id = req.params.themeID;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Theme not found');
    }

    res.redirect('/thema-aanpassen');
  } catch (err) {
    console.error(err);
    
    res.status(500).send('Failed to delete theme');
  }
});

app.get('/col_thema/:id', async (req, res) => {
  const theme = await collection.findOne({ _id: ObjectId(req.params.id) });
  res.render('theme-builder2', { theme, col_thema });
});



app.get('/form', (req, res) => {
  res.render('form.ejs');
});


app.post('/submit', (req, res) => {
  const name = req.body.test;
  res.send(`Name: ${name}`);
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.error();
});
