var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
    id: String,
    resetcount: Number,
    author: String,
    date: String,
    body: String
});

module.exports = mongoose.model('Sessions', sessionSchema);
