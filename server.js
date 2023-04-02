const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");

//require the http module
const http = require("http").Server(app);
// require the socket.io module
const io = require("socket.io");

//bodyparser middleware
app.use(bodyParser.json());

const port = 1337;


app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('test');
});

//database
const { MongoClient, ServerApiVersion } = require('mongodb');

//password in env
require('dotenv').config();
const password = process.env.PASSWORD;

//url om te verbinden
const uri = "mongodb+srv://adminuser:" + password + "@studsdb.8yrtlny.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//routes
app.use("/chats", chatRouter);

//integrating socketio
socket = io(http);

//database connection
const Chat = require("./models/Chat");
const connect = require("./dbconnect");

//setup event listener
socket.on("connection", socket => {
    console.log("user connected");
  
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  
    //Someone is typing
    socket.on("typing", data => {
      socket.broadcast.emit("notifyTyping", {
        user: data.user,
        message: data.message
      });
    });
  
    //when soemone stops typing
    socket.on("stopTyping", () => {
      socket.broadcast.emit("notifyStopTyping");
    });
  
    socket.on("chat message", function(msg) {
      console.log("message: " + msg);
  
      //broadcast message to everyone in port:5000 except yourself.
      socket.broadcast.emit("received", { message: msg });
  
      //save chat to the database
      connect.then(db => {
        console.log("saved to database");
        let chatMessage = new Chat({ message: msg, sender: user });
  
        chatMessage.save();
      });
    });
  });



app.listen(port, function() {
    console.log('test');
});

http.listen(port, () => {
    console.log("Running on Port: " + port);
  });