const {
  log
} = require("console");
const express = require("express");
const Chats = require("../models/chatSchema");
const router = express.Router();

// router.route("/:user1ID&&:user2ID").get( async (req, res) => {
//    const id1 = req.params.user1ID;
//    const id2 = req.params.user2ID;
//    const chatID = [`${id1}`, `${id2}`];
//    const chat = await col_chats.findOne({
//   chatID
// });
//   Chats.find(chat).then((results) => {
//     console.log(results)
//     res.render("chat", {Chats: results });
//   });
// });

router.route("/:chats").get(async (req, res) => {
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