import * as React from 'react';

import useProfile from '@/hooks/use-profile';

import reducer from './reducer';
import { type ProviderState } from './types';
import { useRoomContext } from '@/context/Room/RoomContext';

const ChatContext = React.createContext({} as ProviderState);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chat, dispatch] = React.useReducer(reducer, {
    publicChat: [],
    roomChat: [],
    onlineUsers: 0,
    showNotification: false,
  });

  const {
    room: { socket },
  } = useRoomContext();

  const { user } = useProfile();

  React.useEffect(() => {
    if (socket) {
      socket.emit('get online users');
      socket
        .off('online users')
        .on('online users', (users: number) =>
          dispatch({ type: 'SET_ONLINE_USERS', payload: users })
        );
    }
  }, [socket, user]);

  return (
    <ChatContext.Provider value={{ chat, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => React.useContext(ChatContext);