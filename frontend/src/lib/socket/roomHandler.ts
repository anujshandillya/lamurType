import { Socket } from 'socket.io-client';
import { v4 } from 'uuid';

export const createRoom = (
  socket: Socket,
  mode: 'words' | 'sentences' | 'numbers'
) => {
  const id = v4().slice(0, 6);
  socket.emit('create room', id, mode);
};
