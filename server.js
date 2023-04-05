const express = require('express');
const app = express();
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const chatRouter = require("./routes/chatroute");

//require the http module
const http = require("http").Server(app);
// require the socket.io module
const io = require("socket.io");

//bodyparser middleware
app.use(express.json());

const port = 1337;


//set the express.static middleware
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');



//database
const { MongoClient, ServerApiVersion } = require('mongodb');

//password in env
require('dotenv').config();
const password = process.env.PASSWORD;

//url om te verbinden
const uri = "mongodb+srv://adminuser:" + password + "@studsdb.8yrtlny.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const connect = mongoose.connect(uri, {
  dbName: 'studsdb', useNewUrlParser: true, useUnifiedTopology: true });
connect.then(
  (db) => {
    console.log("Connected Successfully to Mongodb Server")},
  (err) => {
    console.log(err)}
);

module.exports = connect;



//routes
app.use("/chats", chatRouter);

//integrating socketio
socket = io(http);

//database connection
const Chat = require("./models/chatSchema");

//setup event listener
socket.on("connection", function() {
    console.log("user connected");
  })
  
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  
    //Somebody is typing
    socket.on("typing", data => {
      socket.broadcast.emit("notifyTyping", {
        user: data.user,
        message: data.message
      });
    });
  
    //when somebody stops typing
    socket.on("stopTyping", () => {
      socket.broadcast.emit("notifyStopTyping");
    });
  
    socket.on("chat message", function(msg) {
      console.log("message: " + msg);
  
      //broadcast message to everyone in port except yourself.
      socket.broadcast.emit("received", { message: msg });
  
      //saves chat to the database
      connect.then(db => {
        console.log("saved to database");
        let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
  
        chatMessage.save();
      });
    });



http.listen(port, () => {
    console.log("Running on Port: " + port);
  });