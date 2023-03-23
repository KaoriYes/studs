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

app.post('/submit', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const secondpassword = req.body.confirm_password;
  const leerjaar = req.body.leerjaar;
 
  connectDB();
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
      leerjaar
      // no need for : value if key and value are the same
    };
    db.collection('Users').insertOne(userdata, function (err, collection) {
      if (err) throw err;
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
 
  connectDB();
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
    db.collection('Users').insertOne(userdata, function (err, collection) {
      if (err) throw err;
      console.log('Record inserted Successfully');
    });

  }
});



app.listen(port, function() {
    console.log('test');
});