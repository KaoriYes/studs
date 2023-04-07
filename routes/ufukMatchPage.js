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

// session auth
const checkLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/preRegister");
  }
};

//vakken datsase
const databaseVakken = client.db("studsdb");
const collectionVakken = databaseVakken.collection("col_vakken");
//users database
const databaseUsers = client.db("studsdb");
const collectionUsers = databaseUsers.collection("col_users");

//col voor de studs
const databaseStuds = client.db("studsdb");
const collectionStuds = databaseStuds.collection("col_studs");

//route naar de matchpage
router.get("/matchpage", checkLogin, async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  console.log(user)
  const selectedVakken = user.selectedVakken;
  console.log(selectedVakken)
  const selectedStuds = await collectionStuds
    .find({
      vakken: {
        $in: selectedVakken,
      },
    })
    .toArray();
  console.log(selectedVakken);
  res.render("MatchPage.ejs", {
    selectedStuds,
    user,
    selectedVakken,
  });
});

// route voor liken
router.post("/like", async (req, res) => {
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

// route voor unliken
router.post("/unlike", async (req, res) => {
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

//route naar liked studs
router.get("/likedstuds", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  const studs = await collectionStuds
    .find({
      liked: true,
    })
    .toArray();
  res.render("likedStuds.ejs", {
    studs: studs,
    user,
  });
});

router.get("/sidebar", async (req, res) => {
  const studs = await collectionStuds.find().toArray();
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  res.render("sidebar.ejs", {
    studs: studs,
    user,
  });
});

module.exports = router;
