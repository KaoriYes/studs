require("dotenv").config();

const express = require("express");
const router = express.Router();

//database verbinden
const { MongoClient, ServerApiVersion } = require("mongodb");
const { addAbortSignal } = require("stream");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const { ObjectId } = require("mongodb");

//vakken datsase
const databaseVakken = client.db("studsdb");
const collectionVakken = databaseVakken.collection("col_vakken");
//users database
const databaseUsers = client.db("studsdb");
const collectionUsers = databaseUsers.collection("col_users");

// filter pagina
router.get("/", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  const selectedVakken = user.selectedVakken;
  console.log(selectedVakken);
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

// filters posten
router.post("/", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  const selectedVakken = user.selectedVakken;
  const selectedJaar = req.body.jaar;
  collectionVakken
    .find({
      jaar: selectedJaar,
    })
    .toArray()
    .then((vakken) => {
      const vaknamen = vakken.map((vak) => vak.naam); // Extract name field
      res.render("filter.ejs", {
        vakken: vaknamen,
        jaar: selectedJaar,
        user,
        selectedVakken,
      });
    });
});

router.post("/nextPage", async (req, res) => {
  const selectedVakken = req.body.selectedVakken;

  collectionUsers.updateOne(
    {
      email: req.session.user.email,
    },
    {
      $set: {
        selectedVakken,
      },
    }
  );
  res.redirect("/matchpage");
});

module.exports = router;
