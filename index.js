var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.post('/join/:id', function(req, res) {
    io.to(req.params.id).emit('chatroom_begin');
    res.end();
});

io.on('connection', function(socket) {
    socket.on('start_room', function() {
        var roomId = "A.B.C. 1 2 3";
        socket.join(roomId);
        socket.emit('joined_room', roomId)
    });
});

var port = (process.env.PORT || 5000);
http.listen(port, function() {
    console.log('listening on *:3000');
});