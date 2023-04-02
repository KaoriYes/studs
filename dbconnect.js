const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const dbURI = process.env.DATABASE_URL;


const connect = mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  connect.then(
    (db) => {
      console.log("Connected Successfully to Mongodb Server");
  
    },
    (err) => {
      console.log(err);
    }
  );

module.exports = connect;