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

module.exports = History;