import io from 'socket.io-client';
import config from "../../config/config.json";

let socket = null;
let currentUserId = null;

export function initSocket(userId) {
  if (!userId) {
    console.warn('initSocket called without userId');
    return null;
  }

  if (socket && currentUserId === userId) {
    return socket;
  }

  if (socket) {
    try { socket.disconnect(); } catch (e) {}
    socket = null;
  }

  currentUserId = userId;

  socket = io(config.BASE_API_URL_COMPANY, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    // transports: ['polling'],
    query: { userId: String(userId) },
  });

  socket.on('connect', () => {
    console.log('[socket] connected', socket.id, 'userId=', userId);
    // IMPORTANT: register user in SocketService
    socket.emit('addUser');
  });

  socket.on('connect_error', (err) => console.error('[socket] connect_error', err?.message || err));
  socket.on('disconnect', (reason) => console.log('[socket] disconnected', reason));

  return socket;
}

export function getSocket() {
  return socket;
}

export function closeSocket() {
  if (socket) {
    try { socket.disconnect(); } catch (e) {}
    socket = null;
    currentUserId = null;
  }
}
