const express = require("express");
const Chats = require("../models/chatSchema");
const router = express.Router();
// const chatController = require("../controllers/chatController");

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

const databaseUsers = client.db("studsdb");
const collectionUsers = databaseUsers.collection("col_users");


const checkChat = async (req, res, next) => {
   const chat1id = req.params.chats;
    user1 = req.session.user.email;
   const user = await collectionUsers.findOne({
    email: user1
  });
  const chatID = user.chats;
  if ( chatID == chat1id) {
    next();
  }
  else{
    res.redirect("/account");
  }
};

router.route("/:chats").get( checkChat, async (req, res) => {
  const chat1id = req.params.chats;
  console.log(chat1id);
  if (chat1id) {
    Chats.find({
      chatID: chat1id
    }).then((results) => {
      console.log(results)
      res.render("chat", {
        Chats: results
      });
    });
  } else {
    res.status(404).send("Chat not found");
  }
});
module.exports = router;