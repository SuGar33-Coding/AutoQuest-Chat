const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const moment = require('moment');
const logFormat = 'MMM D, YYYY HH:mm:ss';

const ch = require('chalk');

/* Serve up dummy html page for testing */
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

/* Handle socket connections */
io.on('connection', (socket) => {
    console.log(`User '${socket.id}' connected`);

    socket.on('msg-main', (msg) => {
        console.log(`${ch.red.bgBlack(moment().format(logFormat))}: User ${ch.blue(socket.id)} sent msg: ${ch.yellow(msg)}`);
        socket.broadcast.emit('msg-main', msg, socket.id);
    });

    socket.on('msg-private', (msg, targetUser) => {
        console.log(`${ch.red.bgBlack(moment().format(logFormat))}: User ${ch.blue(socket.id)} sent pm to user ${ch.blue(targetUser)}: ${ch.yellow(msg)}`);
        io.to(targetUser).emit('msg-private', msg, socket.id);
    });
});

/* SPin up server */
var port = process.env.PORT || 3001;
http.listen(port, () => {
    console.log(`Chat server listening at http://localhost:${port}`);
});