require("dotenv").config();

const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBSession = require("express-mongodb-session")(session);
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const chatRouter = require("./routes/chatroute");
const sharedSession = require("express-socket.io-session");
const compression = require("compression");

//require the http module
const http = require("http").Server(app);
// require the socket.io module
const io = require("socket.io");

//bodyparser middleware
app.use(express.json());

const port = 1337;
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer({
  dest: "public/uploads/",
});

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
const connect = mongoose.connect(uri, {
  dbName: "studsdb",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connect.then(
  (db) => {
    console.log("Connected Successfully to Mongodb Server");
  },
  (err) => {
    console.log(err);
  }
);

module.exports = connect;
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", checkLogin, async (req, res) => {
  res.redirect("/matchpage");
});

app.use(compression());
app.use("/", require("./routes/ufukMatchPage"));
app.use("/matchpage", require("./routes/ufukMatchPage"));
app.use("/studentRegister", require("./routes/qtLoginRegister"));
app.use("/preRegister", require("./routes/qtLoginRegister"));
app.use("/login", require("./routes/qtLoginRegister"));
app.use("/registerQuestion", require("./routes/qtLoginRegister"));
app.use("/logout", require("./routes/qtLoginRegister"));
app.use("/studentRegister", require("./routes/qtLoginRegister"));
app.use("/account", require("./routes/qtLoginRegister"));

app.use("/filter", require("./routes/bartFilter"));
app.use("/nextPage", require("./routes/bartFilter"));
app.use("/theme", require("./routes/aliTheme"));
app.use("/themaAanpassen", require("./routes/aliTheme"));

// app.use("/chat", require("./routes/svenChat"));

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

// Set up middleware

app.use(bodyParser.json());

// In-memory store for themes
let col_thema = [];
let randomQuote;

col_thema.forEach((theme) => {
  console.log(theme);
});

const collection = client.db("studsdb").collection("col_thema");

// Start the server

const { ObjectId } = require("mongodb");
const { log } = require("console");

app.use("/chats", chatRouter);

//integrating socketio
socket = io(http);
//session
socket.use(
  sharedSession(session1, {
    autoSave: true,
  })
);
//database connection
const Chat = require("./models/chatSchema");

//setup event listener
socket.on("connection", async (socket) => {
  console.log("user connected");
  console.log(socket.handshake.session.user.name);

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  //Somebody is typing
  socket.on("typing", (data) => {
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message,
    });
  });

  //when somebody stops typing
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });

  socket.on("chat message", async function (msg) {
    console.log("message: " + msg);

    //broadcast message to everyone in port except yourself.
    socket.broadcast.emit("received", {
      message: msg,
    });

    //saves chat to the database
    connect.then(async (db) => {
      const user1 = socket.handshake.session.user.name;
      const user = await collectionUsers.findOne({
        name: user1,
      });
      let chatMessage = new Chat({
        message: msg,
        sender: user.name,
      });

      chatMessage.chatID = user.chats;
      await chatMessage.save();
    });
  });
});
http.listen(port, () => {
  console.log("Running on Port: " + port);
});
