const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const { STATIC_CHANNELS } = require('./channels');

const PORT = 8080;

const corsOptions = {
  origin: 'http://localhost:3000',
};

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: corsOptions });

app.use(cors(corsOptions));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('new client connected');
  socket.emit('connection', null);
  socket.on('channel-join', (id) => {
    console.log('channel join', id);
    STATIC_CHANNELS.forEach((c) => {
      if (c.id === id) {
        if (c.sockets.indexOf(socket.id) == -1) {
          c.sockets.push(socket.id);
          c.participants++;
          io.emit('channel', c);
        }
      } else {
        let index = c.sockets.indexOf(socket.id);
        if (index !== -1) {
          c.sockets.splice(index, 1);
          c.participants--;
          io.emit('channel', c);
        }
      }
    });

    return id;
  });
  socket.on('send-message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    STATIC_CHANNELS.forEach((c) => {
      let index = c.sockets.indexOf(socket.id);
      if (index != -1) {
        c.sockets.splice(index, 1);
        c.participants--;
        io.emit('channel', c);
      }
    });
  });
});

app.get('/getChannels', (req, res) => {
  res.json({
    channels: STATIC_CHANNELS,
  });
});
