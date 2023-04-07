require("dotenv").config();

const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 12;
const session = require("express-session");
const MongoDBSession = require("express-mongodb-session")(session);

//database verbinden
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const databaseUsers = client.db("studsdb");
const collectionUsers = databaseUsers.collection("col_users");


//session store
const store = new MongoDBSession({
  uri: uri,
  collection: "col_sessions",
  databaseName: "studsdb",
});
const secret = process.env.SECRET;
const session1 = session({
  secret: secret,
  cookie: {
    maxAge: 2592000000,
  },
  resave: false,
  saveUninitialized: false,
  store: store,
});
app.use(session1);

// session auth
const checkLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/preRegister");
  }
};

const checkLoggedin = (req, res, next) => {
  if (req.session.user) {
    res.redirect("back");
  } else {
    next();
  }
};


// --- routes ---
router.get("/studentRegister", checkLoggedin, (req, res) => {
  res.render("studentRegistrer.ejs", {
    title: "Student Register",
    subtitle: "",
  });
});

router.get("/preRegister", checkLoggedin, (req, res) => {
  res.render("preRegister.ejs", {
    title: "Register",
  });
});

router.get("/login", checkLoggedin, (req, res) => {
  res.render("preRegister.ejs", {
    title: "Login",
  });
});

router.get("/registerQuestion", (req, res) => {
  res.render("registerQuestion.ejs", {
    title: "Register",
  });
});

router.post("/login", async (req, res) => {
  res.locals.title = "Login";
  // get form data and requested email from db
  const { email, password } = req.body;
  const requestedUser = await collectionUsers.findOne({
    email,
  });
  console.log(requestedUser);

  // --- check if login is valid ---
  if (requestedUser) {
    // check db for input email and compare passwords > if match log in user
    const isMatch = await bcrypt.compare(password, requestedUser.hashedpw);
    if (isMatch) {
      req.session.authenticated = true;
      req.session.user = {
        email,
        id: requestedUser._id,
        name: requestedUser.name,
      };
      req.session.save();
      res.redirect("/filter");
      // console.log(session);
    } else {
      // if password incorrect
      res.render("preRegister", {
        email: req.body.email,
        error: "Incorrect email or password",
      });
      console.log("Incorrect  password");
    }
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.clearCookie("connect.sid");
    res.redirect("/account/preRegister");
  });
});

router.post("/studentRegister", async (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = req.body.password;
  const secondpassword = req.body.confirm_password;
  const leerjaar = req.body.leerjaar;

  if (password !== secondpassword) {
    res.render("studentRegister.ejs", {
      title: "Student Register",
      subtitle: "Password does NOT match!",
    });
  } else if (
    !name ||
    !surname ||
    !email ||
    !password ||
    !secondpassword ||
    !leerjaar
  ) {
    res.render("studentRegistrer.ejs", {
      title: "Student Register",
      subtitle: "Please fill in all fields!",
    });
  } else {
    const hashedpw = await bcrypt.hash(password, saltRounds);
    var userdata = {
      name,
      surname,
      hashedpw,
      email,
      leerjaar,
      selectedVakken: "",
      // no need for : value if key and value are the same
    };

    collectionUsers.insertOne(userdata, function (err) {
      if (err) {
        throw err;
      } else {
      }
    });
    const requestedUser = await collectionUsers.findOne({
      email,
    });
    console.log(requestedUser);
    req.session.authenticated = true;
    req.session.user = {
      email,
      id: requestedUser._id,
      name: requestedUser.name,
    };
    req.session.save();

    res.redirect("/filter");
  }
});

router.get("/", checkLogin, async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  const user2 = await collectionUsers.findOne({
    email: "Quintenkok@me.com",
  });
  res.render("account.ejs", {
    title: "Account",
    user,
    user2,
  });
});

module.exports = router;
