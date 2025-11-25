const { Server } = require('socket.io');

let io = null;

function initSocket(server) {
  if (io) return io;
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // Optionally join rooms based on query (e.g., userId)
    const { userId } = socket.handshake.query || {};
    if (userId) socket.join(userId);

    socket.on('disconnect', () => {});
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket not initialized');
  return io;
}

function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(userId).emit(event, payload);
}

async function createAndEmitNotification(userId, notification) {
  // In a real app, persist notification then emit. Here emit directly
  emitToUser(userId, 'notification', notification);
}

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  createAndEmitNotification,
};
