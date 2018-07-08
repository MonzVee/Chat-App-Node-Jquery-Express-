var mongoose = require('mongoose');

var ChatSchema = mongoose.Schema({
  user:{
    type: String,
    required: true
  },
  text:{
    type: String,
    required: true
  },
  createDate:{
    type: Date,
    required: false,
    default: Date.now
  }
});

// var Chat = mongoose.model('Chat', ChatSchema);
module.exports = mongoose.model('Chat',ChatSchema);
