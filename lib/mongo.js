/* jshint esversion: 6 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// var database = function(dbP = 'mongodb://localhost/test') {
//     dbPath = dbP;
//     mongoose.connect(this.dbPath);
// };
//
var db = mongoose.connection;
db.on('error', function(err) {
    // console.error('connection to ', dbPath, ' failed');
    console.error('connection error: ', err);
});

db.once('open', function() {
    console.log('connection to ', ' successful');
});

module.exports = mongoose;
