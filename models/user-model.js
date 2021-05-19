const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String, 
  email: String,
  base: String, //base city
  city: [{
    type: String,
    createdAt: Number
  }],
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
  // searchedCities: [ String ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;