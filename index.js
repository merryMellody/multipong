const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

let ballPos = {};

app.set('port', 5000);
app.use('/static', express.static(`${__dirname}/static`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('moveP1', (newP1Y) => {
    io.emit('moveP1', newP1Y);
  });
  socket.on('moveP2', (newP2Y) => {
    io.emit('moveP2', newP2Y);
  });
  socket.on('unpause', () => {
    io.emit('unpause');
  });
  socket.on('pause', () => {
    io.emit('pause');
  });
  socket.on('moveBall', ({ x, y }) => {
    ballPos = { x, y };
    io.emit('moveBall', ballPos);
  });
  socket.on('setScore', ({ p1, p2 }) => {
    io.emit('setScore', { p1, p2 });
  });
});

server.listen(5000, () => {
  console.log('Starting server on port 5000');
});
