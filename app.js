var express = require('express');
var app = express();
var io = require('socket.io')();

const port = process.env.PORT || 3000;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

io.attach(server);

var numUsers = 0;


io.on('connection', function(socket) {
    console.log('new user has connected');

    // get socket id to check the current user.
    socket.emit('connected', { sID: `${socket.id}`} );
    // add user count
    ++numUsers;
    io.emit('usercount', { numUsers: numUsers});
    // use notifications to check if new user has joined.
    io.emit('notification', { message: "new user has connected"});
 


    // listen for an incoming message from anyone connected to the app
    socket.on('chat message', function(msg) {
        // console.log('message: ', msg, 'socket:', socket.id);

        // send the message to everyone connected to the app
        io.emit('chat message', { id: `${socket.id}`, message: msg, notification: "new user has connected"});
    });

    socket.on('typing', function(name){
        io.emit('typing', name);
      });
      socket.on('stoptyping', function() {
        io.emit('typing');
      });

    socket.on('disconnect', function() {
        console.log('a user has disconnected');
        --numUsers;
        io.emit('usercount', { numUsers: numUsers});
        io.emit('notification', { message: "a user has disconnected"});
      
    });
});