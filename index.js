var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.post('/join/:id', function(req, res) {
    io.to(req.params.id).emit('chatroom_begin');
    res.end();
});

function roomIdExists(roomId) {
    return io.sockets.adapter.rooms.hasOwnProperty(roomId);
}

function generateId() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 6; i++)
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}

function speechifyId(idStr) {
    return idStr.replace(/[a-zA-Z]/g, "$& ").replace(/[0-9]/g, "$& ")
}

io.on('connection', function(socket) {
    socket.on('start_room', function() {
        var roomId;
        do {
            roomId = generateId();
        }
        while (roomIdExists(roomId));

        socket.join(roomId);
        socket.emit('joined_room', {
            roomId: roomId,
            speechifiedId: speechifyId(roomId)
        });
    });
});

var port = (process.env.PORT || 5000);
http.listen(port, function() {
    console.log('listening on *:', port);
});