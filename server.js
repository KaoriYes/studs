require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const port = process.env.PORT;
const {
  ObjectId
} = require('mongodb');

app.use(express.static("public"));
app.use("*/css", express.static("public/css"));
app.use("*/img", express.static("public/img"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/", (req, res) => {
  res.send("test");
});

//database
const {
  MongoClient,
  ServerApiVersion
} = require("mongodb");

//password in env
const password = process.env.PASSWORD;

//url om te verbinden
const uri =
  "mongodb+srv://adminuser:" +
  password +
  "@studsdb.8yrtlny.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//col voor de studs
const databaseStuds = client.db("studsdb");
const collectionStuds = databaseStuds.collection("col_studs");


//route naar de matchpage
app.get("/matchpage", async (req, res) => {
  const studs = await collectionStuds.find().toArray();
  res.render("MatchPage.ejs", {
    studs: studs,
  });
});

//route naar liked studs
app.get("/likedstuds", async (req, res) => {
  const studs = await collectionStuds.find({
    liked: true
  }).toArray();
  res.render("likedStuds.ejs", {
    studs: studs,
  });
});

app.post("/like", async (req, res) => {
  const studId = req.body.studId;
  await collectionStuds.updateOne({
    _id: new ObjectId(studId)
  }, {
    $set: {
      liked: true
    }
  });
  res.redirect("/matchpage");
});


app.listen(port, function () {
  console.log(port);
});