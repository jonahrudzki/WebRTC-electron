// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create the Express app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (for example: index.html)
app.use(express.static('public'));

// Set up WebSocket communication using socket.io
io.on('connection', socket => {
  console.log('A user connected');

  // Handle SDP offer
  socket.on('offer', (offer) => {
    console.log('Received offer: ', offer);
    // Broadcast the offer to all other clients except the sender
    socket.broadcast.emit('offer', offer);
  });

  // Handle SDP answer
  socket.on('answer', (answer) => {
    console.log('Received answer: ', answer);
    // Broadcast the answer to all other clients except the sender
    socket.broadcast.emit('answer', answer);
  });

  // Handle ICE candidate
  socket.on('candidate', (candidate) => {
    console.log('Received ICE candidate: ', candidate);
    // Broadcast the ICE candidate to all other clients except the sender
    socket.broadcast.emit('candidate', candidate);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = 8080
server.listen(PORT, () => {
  console.log(`Server is running on port ${8080}`);
});
