module.exports = function(app) {
  var chat = require('../controllers/chat.controllers.js');

  app.post('/history', chat.create);

  app.get('/history', chat.findAll);
}
