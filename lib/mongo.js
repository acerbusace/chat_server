/* jshint esversion: 6 */

var dbPath = 'mongodb://localhost/chat_server';

const mongoose = require('mongoose');
mongoose.connect(dbPath);

var db = mongoose.connection;
db.on('error', function(err) {
  console.error('connection to ', dbPath, ' error: ', err);
});

db.once('open', function() {
  console.log('connection to ', dbPath, ' successful');

  var mongo = {};

  userSchema = mongoose.Schema({
    username: String,
    password: String,
  });

  userSchema.methods.validPassword = function(password) {
    if (password === this.password) return true;
    return false;
  }

  userSchema.methods.getId = function() {
    return this._id;
  }

  var userModel = mongoose.model('user', userSchema);

  mongo.createUser = function(userInfo) {
    console.log('creating user: ', userInfo);
    var newUser = new userModel(userInfo);
    newUser.save(function(err) {
      if (err) console.error('saving ', userInfo, ' to database error: ', err);
      else console.log('saving ', userInfo, ' to database successful');
    });
  }

  var findUser = function(query, callback) {
    userModel.find(query, function(err, user) {
      console.log('user: ', user);
      if (err) {
        console.error('finding ', username, ' in database error: ', err);
        return callback();
      }
      else if (user[0] !== undefined) {
        console.log('finding ', user[0], ' in database successful');
        return callback(user[0]);
      }
    });
  }

  mongo.validate = function(username, password) {
    findUser({'username': username}, function(user) {
      if (user) {
        if (user.validPassword(password))
          return user.getId();
      }
      return null;
    });
  }

  if (typeof(callback) == 'function')
    callback(mongo);
});


// module.exports = mongoose;
module.exports = function(cb) {
  callback = cb;
}
