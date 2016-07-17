///<reference path="../../typings/bcrypt/bcrypt.d.ts" />
///<reference path="../../typings/mongoose/mongoose.d.ts" />
///<reference path="../../typings/jwt-simple/jwt-simple.d.ts" />

var Post=require('../../db/post')
var User=require('../../db/user')
var bcrypt=require('bcrypt')
var jwt=require('jwt-simple')
var config = require('../../config')
var ws=require('../../ws/WebSocket')



var router=require('express').Router()


router.get('/api/posts', function(req,res)
    {
        Post.find(function(err,posts)
        {
            if(err)
                return next(err)
            
            res.json(posts)
        })
    }
)
router.get('/api/posts/:username', function(req,res)
    {
        Post.find({username:req.params.username}).exec(function(err,posts)
        {
            if(err)
                return next(err)
            
            res.json(posts)
        })
    }
)

router.post('/api/post', function(req,res)
    {
        console.log('post reseived')
        console.log(req.auth.username)
        console.log(req.body.body)
        var post = new Post({
            username: req.auth.username,
            body:req.body.body
        })

        post.save(function(err,post)
        {
            if(err)
            {
                return next(err)
            }
            ws.broadcast('new_post',post)
            res.status(201).json(post)
        })

    }
)

router.post('/api/user/session', function(req,res)
{
    User.findOne({username:req.body.username}).select('password').select('username').exec(function(err,user)
    {
        if(err)
        {
            return next(err);
        }

        if(!user)
        {
            return res.send(404);
        }

        bcrypt.compare(req.body.password, user.password, function(err, valid)
        {
            if(err)
            {
                return next(err)

            }

            if(!valid)
            {
                return res.send(401)
            }

            var token = jwt.encode({username: user.username},config.key)

            res.json(token)
        })
    })
})
router.post('/api/user/add',function(req, res)
{
    var user = User({username:req.body.username});
    bcrypt.hash(req.body.password,10,function(err,hash) 
    {
        user.password = hash;
        console.log("Adding user %s, $s", user.username, user.password)        
        user.save(
            function(err) 
            {
                if(err)
                {
                    throw next(err);
                }
                res.send(201)
            });
    })
 })

 router.get('/api/user/info', function(req, res)
    {
        var token = req.headers['x-auth'];
        var auth = jwt.decode(token, config.key);
        User.findOne({username:auth.username}).exec(function(err,user)
        {
            if(err)
                return next(err);
            res.json(user);
        })
    }
 )
module.exports=router