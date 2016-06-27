/* jshint esversion: 6 */

var dbPath = 'mongodb://localhost/chat_server';

const mongoose = require('mongoose');
mongoose.connect(dbPath, function(err) {
  if (err)
    return mCallback('connection to ' + dbPath + ' error: ' + err);

  console.log('connection to ', dbPath, ' successful');

  var mongo = {};

  userSchema = mongoose.Schema({
    username: String,
    password: String,
  });

  userSchema.methods.validPassword = function(password) {
    if (password === this.password)
      return true;
    return false;
  };

  userSchema.methods.getId = function() {
    return this._id;
  };

  var userModel = mongoose.model('user', userSchema);

  mongo.createUser = function(userInfo) {
    console.log('creating user: ', userInfo);
    var newUser = new userModel(userInfo);
    newUser.save(function(err) {
      if (err) console.error('saving ', userInfo, ' to database error: ', err);
      else console.log('saving ', userInfo, ' to database successful');
    });
  };

  var findUser = function(query, done) {
    userModel.findOne(query, function(err, user) {
      console.log('user: ', user);
      if (err) {
        console.error('finding ', query, ' in database error: ', err);
        return done();
      }
      else if (!user)
        return done();
      return done(user);
    });
  };

  mongo.validate = function(username, password, done) {
    findUser({'username': username}, function(user) {
      if (user) {
        if (user.validPassword(password))
          return done(user.getId());
      }
      return done();
    });
  };

  if (typeof(mCallback) == 'function')
    return mCallback(null, mongo);
});

module.exports = function(cb) {
  mCallback = cb;
};
