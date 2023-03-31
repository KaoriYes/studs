const mongoose = require("mongoose");
const StudsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  leerjaar: {
    type: Integer,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  vakken: {
    type: Array,
    required: true,
  },
});
const stud = mongoose.model("Studs", UserSchema);
//module.exports = User;
