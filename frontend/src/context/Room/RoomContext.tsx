import * as React from 'react';
import { io } from 'socket.io-client';
import { animals, uniqueNamesGenerator } from 'unique-names-generator';

import reducer from './reducer';
import { type ProviderState } from './types';
import { useRouter } from '@/hooks/use-router';
import useProfile from '@/hooks/use-profile';

const socket = io('http://localhost:4000',
  {
    autoConnect: false,
  }
);

const RoomContext = React.createContext({} as ProviderState);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: userProfile } = useProfile();

  const [room, dispatch] = React.useReducer(reducer, {
    text: '',
    mode: 'words',
    isPlaying: false,
    isFinished: false,
    isChatOpen: false,
    winner: null,
    user: {
      isOwner: false,
      roomId: null,
      username: localStorage?.getItem('nickname') || uniqueNamesGenerator({
        dictionaries: [animals],
        style: 'lowerCase',
      }),
      id: '',
      status: {
        wpm: 0,
        progress: 0,
      },
      isReady: false,
    },
    players: [],
    socket,
  });

  // Update username when user profile becomes available
  React.useEffect(() => {
    if (userProfile) {      
      const nickname = localStorage?.getItem('nickname');
      
      const newUsername = nickname || 
        (userProfile.first_name && userProfile.last_name 
          ? `${userProfile.first_name}${userProfile.last_name}`
          : uniqueNamesGenerator({
              dictionaries: [animals],
              style: 'lowerCase',
            }));
      
      dispatch({ type: 'SET_NICKNAME', payload: newUsername });
    } else {
    }
  }, [userProfile]);

  const [timeBeforeRestart, setTimeBeforeRestart] = React.useState(() => 0);

  const resetTime = async (time: number) => setTimeBeforeRestart(time);

  React.useEffect(() => {
    const dispatchTimeout = setTimeout(() => {
      room.user.isReady && dispatch({ type: 'SET_IS_PLAYING', payload: true });
    }, 5000);

    const restartInterval = setInterval(() => {
      if (room.user.isReady) {
        setTimeBeforeRestart((previousTime) => {
          if (previousTime === 0) {
            clearInterval(restartInterval);
          }
          return previousTime - 1;
        });
      }
    }, 1000);

    return () => {
      clearInterval(restartInterval);
      clearTimeout(dispatchTimeout);
    };
  }, [room.user.isReady]);

  const { pathname } = useRouter();

  React.useEffect(() => {
    socket.on('connect', () => {
      dispatch({ type: 'SET_USER_ID', payload: socket.id });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'SET_IS_READY', payload: false });
      dispatch({ type: 'SET_ROOM_ID', payload: null });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.connect();

    // Cleanup function
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  React.useEffect(() => {
    if (room.user.id && room.user.roomId) {
      socket.emit('room update', room.user);
    }

    if (pathname === '/multiplayer' && room.user.roomId && room.user.id) {
      socket.emit('leave room', room.user);
    }
  }, [pathname, room.user.id, room.user.roomId, room.user.status.wpm, room.user.status.progress]);

  return (
    <RoomContext.Provider
      value={{ room, dispatch, timeBeforeRestart, resetTime }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => React.useContext(RoomContext);