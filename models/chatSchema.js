const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  message: {
    type: String
  },
  sender: {
    type: String
  },
  chatID: {
    type: String
  }
}, {
  timestamps: true
});

let Chat = mongoose.model("col_chats", chatSchema);

module.exports = Chat;