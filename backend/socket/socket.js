let io;

module.exports =  {
  init: httpServer => {
    io = require('socket.io')(httpServer);
  },
  getIo: () => {
    if (!io) {
      throw new Error('Io not initialized');
    }
    return io;
  }
}