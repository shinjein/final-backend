const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String, // PHONE NUMBER!!!!!!
  screenname: String, // like a screenname
  email: String, // authentificaiton - must be unique - used to log in
  password: String, 
  base: String,
  city: [{
    type: String,
    createdAt: Number
  }]
  // searchedCities: [ String ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;