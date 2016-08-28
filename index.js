var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

app.post('/join/:id', function(req, res) {
    io.to(req.params.id).emit('chatroom_begin');
    res.end();
});

io.on('connection', function(socket) {
    var roomId = 'cool_kids';
    socket.join(roomId);
    socket.emit('joined_room', roomId)
});


var port = (process.env.PORT || 5000);
http.listen(port, function() {
    console.log('listening on *:3000');
});