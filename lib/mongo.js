/* jshint esversion: 6 */

const config = require('../config');
const dbPath = config.db.development;

const mongoose = require('mongoose');
mongoose.connect(dbPath, function(err) {
  if (err)
    return mCallback('connection to ' + dbPath + ' error: ' + err);

  console.log('connection to ', dbPath, ' successful');

  var mongo = {};

  userSchema = mongoose.Schema({
    username: String,
    password: String,
    groups: {type: [], default: []},
  });

  userSchema.methods.validPassword = function(password) {
    if (password === this.password) return true;
    return false;
  };

  userSchema.methods.getId = function() {
    return this._id;
  };

  userSchema.methods.getGroups = function() {
    return this.groups;
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

  mongo.findUser = function(query, done) {
    userModel.findOne(query, function(err, user) {
      console.log('user: ', user);
      if (err) {
        console.error('finding ', query, ' in database error: ', err);
        return done();
      } else if (!user) {
        console.error('finding ', query, ' in database error: no matches');
        return done();
      }
      return done(user);
    });
  };

  mongo.updateUser = function(id, query, done) {
    userModel.findByIdAndUpdate(
      id,
      query,
      {safe: true, upsert: true, new: true},
      function(err, user) {
        if (typeof(done) == 'function') {
          if (err) done('saving ' + query + ' to database error: ' + err);
          else done(null, user);
        }
      }
    );
  };

  mongo.userAddGroup = function(id, group, done) {
    mongo.updateUser(id, {$push: {'groups': group}}, function(err, user) {
      if (typeof(done) == 'function') {
        if (err) done(err);
        else done(null, user);
      }
    });
  };

  groupSchema = mongoose.Schema({
    name: String,
    users: {type: [], default: []},
    messages: {type: [], default: []},
  });

  groupSchema.methods.addUser = function(user) {
    this.users.push(user);
  };

  groupSchema.methods.getUsers = function() {
    return this.users;
  };

  groupSchema.methods.addMessage = function(msg) {
    this.messages.push(msg);
  };

  groupSchema.methods.getMessages = function() {
    return this.messages;
  };


  var groupModel = mongoose.model('groups', groupSchema);

  mongo.createGroup = function(groupInfo, done) {
    console.log('creating group: ', groupInfo);
    var newGroup = new groupModel(groupInfo);
    newGroup.save(function(err, group) {
      if (err) {
        console.error('saving ', groupInfo, ' to database error: ', err);
        return done(err);
      }
      else {
        console.log('saving ', groupInfo, ' to database successful');
        return done(null, group.id);
      }
    });
  };

  mongo.findGroup = function(query, done) {
    groupModel.findOne(query, function(err, group) {
      console.log('group: ', group);
      if (err) {
        console.error('finding ', query, ' in database error: ', err);
        return done();
      } else if (!group) {
        console.error('finding ', query, ' in database error: no matches');
        return done();
      }
      return done(group);
    });
  };

  mongo.updateGroup = function(id, query, done) {
    groupModel.findByIdAndUpdate(
      id,
      query,
      {safe: true, upsert: true, new: true},
      function(err, group) {
        if (typeof(done) == 'function') {
          if (err) done('saving ' + query + ' to database error: ' + err);
          else done(null, group);
        }
      }
    );
  };

  mongo.groupAddUser = function(id, user, done) {
    mongo.updateGroup(id, {$push: {'users': user}}, function(err, group) {
      if (typeof(done) == 'function') {
        if (err) done(err);
        else done(null, group);
      }
    });
  };

  mongo.groupAddMessage = function(id, msg, done) {
    mongo.updateGroup(id, {$push: {'messages': msg}}, function(err, group) {
      if (typeof(done) == 'function') {
        if (err) done(err);
        else done(null, group);
      }
    });
  };

  if (typeof(mCallback) == 'function')
    return mCallback(null, mongo);
});

module.exports = function(cb) {
  mCallback = cb;
};
