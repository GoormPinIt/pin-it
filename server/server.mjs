import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
// import cors from 'cors'

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    maxAge: 3600,
  },
});

// 클라이언트 연결 처리
io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    console.log('Message received: ', data);

    io.emit('receive', data);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
