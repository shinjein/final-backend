const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const citySchema = new Schema({
  city: String,
  user:  { //user who searched it
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  contact: [{ //contacts who know a user in this city
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = model('City', citySchema);