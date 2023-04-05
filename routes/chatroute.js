const express = require("express");
const connectdb = require("../server");
const Chats = require("../models/chatSchema");
const router = express.Router();

  router.route("/").get((req, res) => {
    Chats.find().then((results) => {
      console.log(results)
      res.render("chat", {Chats: results });
    });
  });

module.exports = router;