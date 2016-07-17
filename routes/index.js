/* jshint esversion: 6 */

// const express = require('express');
// const router = express.Router();

const dbHandler = require('../lib/mongo.js');
const groupHandler = require('../lib/group.js');





// module.exports = router;
module.exports = function(app, auth, group) {
  function getMessages(req, res) {
    console.log(req.body);
    group.getMessages(req.body.groupId, function(messages) {
      console.log('get messages');
      var data = {
        messages: messages
      };
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  }

  function addMessage(req, res) {
    var data = req.body;
    auth.getUsername(req.user, function(username) {
      data.userId = req.user;
      console.log('chat message: ', data);
      group.addMessage(data.groupId, data);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  }

  function getGroups(req, res, done) {
    group.getGroups(req.user, function(groups) {
      var data = {
        groups: groups
      };
      if (typeof(done) == 'function') {
        // done(JSON.stringify(data));
        console.log('Works!');
        console.log(data);
        done(data);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
      }
    });
  }

  function createGroup(req, res) {
    var data = req.body;
    group.createGroup(data.groupName, req.user, function(group) {
      if (!group) return res.end();

      var data = {
        group: group
      };
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  }

  function addUser(req, res) {
    var data = req.body;
    group.addUser(req.user, data.groupId);
    res.end();
  }

  // router.get('/', (req, res) => {
  //     res.render('index', {});
  // });

  app.post('/getGroups', getGroups);
  app.post('/getMessages', getMessages);
  app.post('/addMessage', addMessage);

  app.use('/', (req, res) => {
    getGroups(req, res, function(data) {
      res.render('index', {data: data});
    });
  });
};
