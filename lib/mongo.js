const mongoose = require('mongoose');

var database = function(dbP = 'mongodb://localhost/test') {
  dbPath = dbP;
  mongoose.connect(this.dbPath);
}

var db = mongoose.connection;
db.on('error', function(err) {
  // console.error('connection to ', dbPath, ' failed');
  console.error('connection error: ', err);
});

db.on('connection', function() {
  console.log('connection to ', dbPath, ' successful');
});

module.exports = database;
