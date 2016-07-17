var express = require('express')
var server = express()
const path = require('path');
var bodyParser=require('body-parser')
var ws = require('./ws/WebSocket')

server.use(bodyParser.json())
server.use(require('./auth'))

server.use(express.static(__dirname + '/ng'))
server.use(express.static(__dirname + '/templates'))


server.get('/', function (req,res)
{
    var layouts = path.join(__dirname + '/layouts')
    res.sendFile(layouts + '/app.html')
})
server.use(require(__dirname + "/controllers/api/static"))
var server = server.listen(process.env.PORT || 8001,serverInit)
ws.connect(server)

function serverInit()
{
    var host = server.address().address;
    var port = server.address().port;
    console.log("Started server at http://%s:%s", host, port)
}
