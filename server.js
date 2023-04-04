require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const port = process.env.PORT;
const ObjectId = require("mongodb").ObjectId;

app.use(express.static("public"));
app.use("*/css", express.static("public/css"));
app.use("*/img", express.static("public/img"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("test");
});

//database
const { MongoClient, ServerApiVersion } = require("mongodb");

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

app.get("/matchpage", async (req, res) => {
  const studs = await collectionStuds.find().toArray();
  res.render("MatchPage.ejs", {
    studs: studs,
  });
});

app.listen(port, function () {
  console.log(port);
});
