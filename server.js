const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBSession = require('express-mongodb-session')(session);
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const saltRounds = 12;
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
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//vakken datsase
const databaseVakken = client.db("studsdb");
const collectionVakken = databaseVakken.collection("col_vakken");
//users database
const databaseUsers = client.db("studsdb");
const collectionUsers = databaseUsers.collection("col_users");

//session store
 const store = new MongoDBSession({ 
    uri: uri, 
    collection: "col_sessions", 
    databaseName: "studsdb",
  });
  const secret = process.env.SECRET;
  app.use( 
    session({
         secret: secret, 
         cookie: { maxAge: 2592000000 }, 
         resave: false,
         saveUninitialized: false,
         store: store,
         }) 
); 
// session auth
const checkLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/preRegister');
  }
};

const checkLoggedin = (req, res, next) => {
  if (req.session.user) {
     res.redirect('back');
  } else {
    next();
  }
};







app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', checkLogin, (req, res) => {
    res.render('index.ejs', {title: 'Home'});
    console.log(session);
    console.log(req.session.user);
    console.log(store);
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
res.redirect('/');// Qt: this is for later..
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
            
      console.log('Record inserted Successfully');
      if (err) {throw err;}
      else{

  }});
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
    res.redirect('/');
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
app.get("/login", checkLoggedin, (req, res) => {
  res.render("login", { title: "Login" });
});
app.post("/login", async (req, res) => { 
  res.locals.title = "Login";
    // get form data and requested email from db 
    const { email, password } = req.body;
    const requestedUser = await collectionUsers.findOne({ email });
    console.log(requestedUser);
    
     // --- check if login is valid --- 
        if (requestedUser) { 
        // check db for input email and compare passwords > if match log in user 
            const isMatch = await bcrypt.compare(password, requestedUser.hashedpw); 
            if (isMatch){ 
                req.session.authenticated = true;
                req.session.user = {
                email, 
                id: requestedUser._id,
                name: requestedUser.name, 
                }; 
                req.session.save(); 
                res.redirect("/"); 
                console.log(session);
            } else { 
            // if password incorrect 
                res.render("login", {
                     email: req.body.email, 
                     error: "Incorrect email or password", 
                    }); 
                    console.log("Incorrect  password");
                } 
            };});
        //     else { 
        //         // if email unauthorised 
        //         res.render("login", { 
        //             email: req.body.email,
        //              error: "Incorrect email", 
        //             });
        //             console.log("Incorrect email");
        //          } 
        //         } else { 
        //         // if user does not exist 
        //         res.render("login", {
        //             email: req.body.email,
        //              error: "Incorrect email or password", 
        //         }); 
        //         console.log("no user");
        //  } 

app.get("/logout", (req, res) => {
     req.session.destroy(err => {
         if (err) console.log(err); 
         res.clearCookie("connect.sid"); 
         res.redirect("/preRegister");
     });
});

app.listen(port, function() {
    console.log(`Server is running on port: ${port}`);
});
