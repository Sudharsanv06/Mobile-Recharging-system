// Minimal socket helper used in tests. Real implementation exists in production.
module.exports = {
  initSocket: () => {},
  getIO: () => ({ emit: () => {} }),
  emitToUser: () => {},
  createAndEmitNotification: () => {},
};
