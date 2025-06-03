import io from 'socket.io-client';

const socket = io('http://localhost:8000', { transports: ['websocket'], reconnectionAttempts: 5 });

export default socket;