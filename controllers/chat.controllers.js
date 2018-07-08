var Chat = require('../models/chat.models.js');
var mongoose = require('mongoose');

exports.create = function(req, res) {
  //Create and save a new message
  console.log("We are inside the controller");
  // console.log(req);
  var chatModel = new Chat({
    user: req.query.user,
    text: req.query.text});

  chatModel.save(function(err, data) {
    if(err) {
      console.log(err);
      res.status(500).send({message: "Some error occured whilst saving chat"});
    } else {
      console.log(data);
      res.send('The chat has been added');
    }
  });
};

exports.findAll = function(req, res) {
  Chat.find(function(err, chat) {
    if(err) {
      console.log(err);
      res.status(500).send({message: "Some error occured whilst retrieving chat."});
    } else {
      res.send(chat);
    }
  });
};

exports.updateByUser = function(req, res) {
  var query = {user: 'muneer'};
  Chat.findOneAndUpdate(query, { user: 'muneer'},
  {new: true}, function(err, doc) {
    if(err) {
      console.log("Something went wrong when updating data!");
    }
    res.send("Updated");
  });
};

exports.deleteChatByUser = function(req, res) {
  Chat.remove({ user: 'muneer'}, function(err) {
    if(err) return handleError(err);
    console.log("Chats removed");
  });
};
