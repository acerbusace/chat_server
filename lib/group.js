module.exports = function(mongo) {
  var group = {};

  group.createGroup = function(name, userId) {
    mongo.createGroup({name: name, users: [userId]}, function(err, groupId) {
      if (err) console.error(err);
      else {
        mongo.userAddGroup(userId, groupId);
      }
    });
  };

  group.getGroups = function(userId, done) {
    mongo.findUser({'_id': userId}, function(user) {
      if (!user) done();
      done (user.getGroups());
    });
  };

  group.addMessage = function(groupId, msg) {
    mongo.groupAddMessage(groupId, msg);
  };

  group.getMessages = function(groupId) {
    mongo.findGroup({'_id': groupId}, function(group) {
      if (group) {
        return group.getMessages();
      }
    });
  };

  return group;
};
