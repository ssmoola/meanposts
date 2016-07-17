///<reference path="../typings/mongoose/mongoose.d.ts" />
var db=require('./db')
var user = db.model('User',
{
    username:String,
    password:{type:String, select:false}
} )

module.exports = user