var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use('/images', express.static('images'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

http.listen(3000, function(){
    console.log('listening on *:3000');
});