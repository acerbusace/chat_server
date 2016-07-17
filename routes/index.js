/* jshint esversion: 6 */

// const express = require('express');
// const router = express.Router();

const dbHandler = require('../lib/mongo.js');
const groupHandler = require('../lib/group.js');

// module.exports = router;
module.exports = function(app, auth, group) {
  function getMessages(req, res, done) {
    // console.log('get messages', req.body.groupId);
    // console.log(req.body.groupId);
    group.getMessages(req.body.groupId, function(data) {
      if (data) {
        // var data = {
        //   messages: messages
        // };

        if (typeof(done) == 'function') {
          done(data);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(data));
        }
      } else {
        if (typeof(done) == 'function') {
          done();
        } else {
          res.end();
        }
      }
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
        // console.log('Works!');
        // console.log(data);
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

  app.post('/getGroups', getGroups);
  app.post('/getMessages', getMessages);
  app.post('/addMessage', addMessage);

  app.use('/', (req, res) => {
    getGroups(req, res, function(data) {
      var groups = [];
      var itemsProcessed = 0;
      data.groups.forEach(function(ele) {
        req.body.groupId = ele;
        getMessages(req, res, function(group) {
          groups.push(group);
          if (++itemsProcessed == data.length) {
            res.render('index', {data: groups});
          }
        });
      });
    });
  });
};
