
///<reference path="../typings/mongoose/mongoose.d.ts" />
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/social', function()
{
    console.log("connected")
})


module.exports = mongoose