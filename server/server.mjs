import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
// import cors from 'cors'

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// 클라이언트 연결 처리
io.on('connection', (socket) => {
  console.log('A user connected');

  // 메시지 수신 및 전파
  socket.on('send_message', (data) => {
    console.log('Message received: ', data);
    io.emit('receive', data); // 모든 클라이언트로 메시지 브로드캐스트

    setTimeout(() => {
      const autoReply = {
        sender: 'Bot',
        text: `Hi ${data.sender}, I received: "${data.text}"`,
        time: new Date().toLocaleTimeString(),
      };
      io.emit('receive', autoReply); // 브로드캐스트
    }, 1000); // 1초 후 답장
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
