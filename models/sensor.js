const mongoose = require('mongoose');
module.exports = mongoose.model('Sensor', new mongoose.Schema({
id: Number,
name: String,
address: String,
data: [
    {
      time: Number,
      temperature: Number
    }
  ]
}));