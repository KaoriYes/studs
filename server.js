require("dotenv").config();

const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBSession = require("express-mongodb-session")(session);
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
require("dotenv").config();
const port = 1337;
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

app.use(express.static("public"));
var path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use("*/css", express.static("public/css"));
app.use("/img", express.static(path.join(__dirname, "public/img")));

app.set("view engine", "ejs");
app.use("/public/", express.static("./public"));
app.use(methodOverride("_method"));
var path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//database verbinden
const { MongoClient, ServerApiVersion } = require("mongodb");
const { addAbortSignal } = require("stream");
require("dotenv").config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//vakken datsase
const databaseVakken = client.db("studsdb");
const collectionVakken = databaseVakken.collection("col_vakken");
//users database
const databaseUsers = client.db("studsdb");
const collectionUsers = databaseUsers.collection("col_users");

//col voor de studs
const databaseStuds = client.db("studsdb");
const collectionStuds = databaseStuds.collection("col_studs");
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

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", checkLogin, async (req, res) => {
  res.redirect("/matchpage");
});

app.get("/account", checkLogin, async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({ email: user1 });
  res.render("account.ejs", {
    title: "Account",
    user,
  });
});
app.get("/preRegister", checkLoggedin, (req, res) => {
  res.render("preRegister.ejs", { title: "Register" });
});
app.get("/registerQuestion", (req, res) => {
  res.render("registerQuestion.ejs", { title: "Register" });
});

//route naar de matchpage
app.get("/matchpage", checkLogin, async (req, res) => {
  const user1 = req.session.user.email; 
  const user = await collectionUsers.findOne({ email: user1 }); 
  const selectedVakken = user.selectedVakken; 
  const selectedStuds = await collectionStuds .find({ vakken: { $in: selectedVakken }, }) .toArray(); 
  console.log(selectedVakken);
  res.render("MatchPage.ejs", { selectedStuds, user, selectedVakken, }); 
});

app.get("/sidebar", async (req, res) => {
  const studs = await collectionStuds.find().toArray();
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({ email: user1 });
  res.render("sidebar.ejs", {
    studs: studs,
    user,
  });
});

app.get("/studentRegister", (req, res) => {
  res.render("studentRegistrer.ejs", {
    title: "Student Register",
    subtitle: "",
  });
});
app.get("/saRegister", (req, res) => {
  res.render("saRegister", {
    title: "Student Assistent Register",
    subtitle: "",
  });
});

app.post("/studentRegister", async (req, res) => {
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
    const requestedUser = await collectionUsers.findOne({ email });
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

app.post("/submit-sa", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const secondpassword = req.body.confirm_password;
  const leerjaar = req.body.leerjaar;
  const richting = req.body.richting;
  if (password !== secondpassword) {
    res.locals.subtitle = "Password does NOT match";
    res.render("studentRegister.ejs");
  } else {
    res.redirect("/");
    const hashedpw = await bcrypt.hash(password, saltRounds);
    var userdata = {
      name,
      hashedpw,
      email,
      leerjaar,
      richting,
      // no need for : value if key and value are the same
    };
    collectionUsers.insertOne(userdata, function (err, collection) {
      if (err) throw err;
      console.log("Record inserted Successfully");
    });
  }
});
app.get("/login", checkLoggedin, (req, res) => {
  res.render("preRegister.ejs", { title: "Login" });
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

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.clearCookie("connect.sid");
    res.redirect("/preRegister");
  });
});
// Set up middleware

app.use(bodyParser.json());

// In-memory store for themes
let col_thema = [];
let randomQuote;

col_thema.forEach((theme) => {
  console.log(theme);
});

const collection = client.db("studsdb").collection("col_thema");

// Insert a new theme into the database
async function insertTheme(theme) {
  try {
    const result = await collection.insertOne(theme);
    console.log("Theme saved to database:", theme);
    col_thema.push(theme);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.post("/nieuwThema", upload.single("image"), async (req, res) => {
  console.log(req.file);
  const { body, file } = req;
  const theme = {
    _id: body.id,
    name: body.name,
    backgroundColor: body.color,
    fontFamily: body.font,
    textColor: body["font-color"],
    images: file.filename,
    thumbnailUrl: `/public/uploads/${file.filename}`,
    user: req.session.user.email,
    active: ""
  };

  try {
    await insertTheme(theme);
    try {
      const user1 = req.session.user.email;
      const user = await collectionUsers.findOne({ email: user1 });
      const renderData = await collection
        .find({ user: req.session.user.email })
        .toArray();
      res.render("matchPage-2", {
        col_thema: renderData,
        theme,
        randomQuote,
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to retrieve themes");
    }
  } catch (err) {
    res.status(500).send({ error: "Failed to save theme" });
  }
});


app.get("/themaAanpassen", async (req, res) => {
  if (!collection) {
    return res.status(500).send("Unable to connect to database");
  }

  try {
    const user1 = req.session.user.email;
    const user = await collectionUsers.findOne({ email: user1 });
    const renderData = await collection
      .find({ user: req.session.user.email })
      .toArray();
    res.render("theme-builder", { col_thema: renderData, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve themes");
  }
});

app.get("/col_thema/:themeID", async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send("Unable to connect to database");
    }

    const response = await fetch(
      "https://opensheet.elk.sh/1er1dtNi_p5eKmqi70bGZLywuDzyce32JqzrywE57gU8/Blad1"
    );
    const quotes = await response.json();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)].texts;

    const id = req.params.themeID;
    const theme = await collection.findOne({ _id: new ObjectId(id) });
    const user1 = req.session.user.email;
    const user = await collectionUsers.findOne({ email: user1 });
    const renderData = await collection.find({ user: user1 }).toArray();
    res.render("theme-builder2", { col_thema: renderData, theme, randomQuote, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve theme");
  }
});

app.delete("/col_thema/:themeID", async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send("Unable to connect to database");
    }

    const id = req.params.themeID;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send("Theme not found");
    }

    res.redirect("/themaAanpassen");
  } catch (err) {
    console.error(err);

    res.status(500).send("Failed to delete theme");
  }
});

app.get("/col_thema/:id", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({ email: user1 });
  const theme = await collection.findOne({
    _id: ObjectId(req.params.id),
    user,
  });
  res.render("theme-builder2", { theme, col_thema, user });
});

app.get("/form", (req, res) => {
  res.render("form.ejs");
});

app.get("/matchpage2", async (req, res) => {
  const { body, file } = req;
  const theme = {
    _id: body.id,
    name: body.name,
    backgroundColor: body.color,
    fontFamily: body.font,
    textColor: body["font-color"],
    user: req.session.user.email,
  };
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({ email: user1 });
  const selectedVakken = user.selectedVakken;
  const selectedStuds = await collectionStuds.find({
vakken: { $in: selectedVakken }, }).toArray();
 console.log(selectedVakken);
  try {
    await insertTheme(theme);
    try {
      const user1 = req.session.user.email;
      const user = await collectionUsers.findOne({ email: user1 });
      const renderData = await collection
        .find({ user: req.session.user.email })
        .toArray();
      res.render("matchPage-2.ejs", {
        col_thema: renderData,
        theme,
        randomQuote,
        user,
        selectedStuds,
        selectedVakken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to retrieve themes");
    }
  } catch (err) {
    res.status(500).send({ error: "Failed to save theme" });
  }
});

app.post("/submit", (req, res) => {
  const name = req.body.test;
  res.send(`Name: ${name}`);
});


app.delete("/col_thema/:themeID", async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send("Unable to connect to database");
    }

    const id = req.params.themeID;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send("Theme not found");
    }

    res.redirect("/themaAanpassen");
  } catch (err) {
    console.error(err);

    res.status(500).send("Failed to delete theme");
  }
});

app.get("/col_thema/:id", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({ email: user1 });
  const theme = await collection.findOne({
    _id: ObjectId(req.params.id),
    user,
  });
  res.render("theme-builder2", { theme, col_thema });
});

app.get("/form", (req, res) => {
  res.render("form.ejs");
});

app.post("/submit", (req, res) => {
  const name = req.body.test;
  res.send(`Name: ${name}`);
});

// Start the server

app.get("/filter", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({ email: user1 });
  const selectedVakken = user.selectedVakken;
  collectionVakken
    .find({})
    .toArray()
    .then((vakken, jaar) => {
      const vaknamen = vakken.map((vak) => vak.naam);
      res.render("filter.ejs", {
        vakken: vaknamen,
        jaar,
        user,
        selectedVakken,
      });
    });
});

app.post("/filter", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({ email: user1 });
  const selectedJaar = req.body.jaar;
  collectionVakken
    .find({ jaar: selectedJaar })
    .toArray()
    .then((vakken) => {
      const vaknamen = vakken.map((vak) => vak.naam); // Extract name field
      res.render("filter.ejs", { vakken: vaknamen, jaar: selectedJaar, user });
    });
});

app.post("/nextPage", async (req, res) => {
  const selectedVakken = req.body.selectedVakken;

  collectionUsers.updateOne(
    { email: req.session.user.email },
    { $set: { selectedVakken } }
  );

  // Check if at least two checkboxes are selected
  //     if (!selectedVakken || selectedVakken.length < ) {
  //       const user1 = req.session.user.email;
  // const user =  await collectionUsers.findOne({ email: user1})
  //       collectionVakken.find({}).toArray().then((vakken, jaar) => {
  //         const vaknamen = vakken.map((vak) => vak.naam);
  //       errorMessage = "Selecteer minstens 2 vakken.";
  //       res.render("filter.ejs", { vakken: vaknamen, errorMessage: errorMessage, user });
  //       console.log(errorMessage)
  //       });
  //     }
  //     // Render the next page or the same page with an error message
  //      else if (errorMessage) {
  //       const user1 = req.session.user.email;
  // const user =  await collectionUsers.findOne({ email: user1})
  //       const errorMessage = "Selecteer minstens 2 vakken.";
  //       res.render("filter.ejs", { vakken: vaknamen, erroMessage: errorMessage, user });
  //       console.log(errorMessage)

  //     } else {
  res.redirect("/matchpage");
  //     }
});

//route naar liked studs
app.get("/likedstuds", async (req, res) => {
  const studs = await collectionStuds
    .find({
      liked: true,
    })
    .toArray();
  res.render("likedStuds.ejs", {
    studs: studs,
  });
});

const { ObjectId } = require("mongodb");
const { log } = require("console");

app.post("/like", async (req, res) => {
  const studId = req.body.studId;
  await collectionStuds.updateOne(
    {
      _id: new ObjectId(studId),
    },
    {
      $set: {
        liked: true,
      },
    }
  );
  res.redirect("/matchpage");
});

app.post("/unlike", async (req, res) => {
  const studId = req.body.studId;
  await collectionStuds.updateOne(
    {
      _id: new ObjectId(studId),
    },
    {
      $set: {
        liked: false,
      },
    }
  );
  res.redirect("/likedStuds");
});

app.listen(port, function () {
  console.log(`Server is running on port: ${port}`);
});
