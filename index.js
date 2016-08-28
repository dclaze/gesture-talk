var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/join/:id', function(req, res) {
    io.to(req.params.id).emit('chatroom_begin');
    res.end();
});

app.post('/message/:id', function(req, res) {
    var message = req.body && req.body.message || "";
    console.log("new message for chatroom id", req.params.id, message);
    io.to(req.params.id).emit('new_message', message);
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