const mongoose = require('mongoose')
var Schema = mongoose.Schema

var HistorySchema = Schema({
    searchStr: {type: String, required: true},
    created_at: {type: Date}
})

HistorySchema.pre('save', function(next){
    var doc = this;
    //this refers to HistorySchema
    doc.created_at = new Date()
    next()
})

var History = mongoose.model('history', HistorySchema)
//In face this is not a good name because a collection named 
//histories will be automatically created by mongodb. The name 
//should be a collection level.

//database name: history (not image search)
//collection name: search ==> searches


module.exports = History;