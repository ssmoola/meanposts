
///<reference path="../typings/mongoose/mongoose.d.ts" />
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/social', function(err)
{
    if (err) {
        console.log("DB connect error")
        throw next(err)
    }
    console.log("DB connected")
})


module.exports = mongoose