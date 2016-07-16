module.exports = function(mongo) {
  var group = {};

  group.createGroup = function(name, userId, done) {
    mongo.createGroup({name: name, users: [userId]}, function(err, group) {
      if (err) {
        console.error(err);
        if (typeof(done) == 'function')
          done();
      }
      else {
        mongo.userAddGroup(userId, group.id);
        if (typeof(done) == 'function')
          done(group);
      }
    });
  };

  group.addUser(userId, groupId) {
    mongo.userAddGroup(userId, groupId);
    mongo.groupAddUser(groupId, userId);
  }

  group.getGroups = function(userId, done) {
    mongo.findUser({'_id': userId}, function(user) {
      if (!user) done();
      done (user.getGroups());
    });
  };

  group.addMessage = function(groupId, msg) {
    mongo.groupAddMessage(groupId, msg);
  };

  group.getMessages = function(groupId, done) {
    mongo.findGroup({'_id': groupId}, function(group) {
      if (!group) done();  
      done(group);
      // done(group.getMessages());
    });
  };

  return group;
};
