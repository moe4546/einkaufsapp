var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = new Schema({
    
    users: [String],
    listname: {type: String, required: true},
    products: [String]
});

module.exports = mongoose.model('List', ListSchema);