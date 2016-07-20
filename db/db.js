
///<reference path="../typings/mongoose/mongoose.d.ts" />
var mongoose = require('mongoose')

mongoose.connect('mongodb://admin:pass@ds023455.mlab.com:23455/social', function(err)
{
    if (err) {
        console.log("DB connect error")
        throw err
    }
    console.log("DB connected")
})


module.exports = mongoose