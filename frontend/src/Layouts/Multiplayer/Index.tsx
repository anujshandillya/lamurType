import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { createRoom } from '@/lib/socket/roomHandler';

import { useRoomContext } from '@/context/Room/RoomContext';
import FormProvider from '@/components/hook-form/FormProvider';
import RHFTextField from '@/components/hook-form/RHFTextField';
import Iconify from '@/components/Iconify';
import Button from '@/components/shared/Button';
import { useRouter } from '@/hooks/use-router';

const schema = yup.object().shape({
  code: yup
    .string()
    .required('code is required')
    .length(6, 'code must be 6 characters long'),
});

export default function MultiplayerPage() {
  const methods = useForm<{ code: string }>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });
  const { handleSubmit } = methods;

  const {
    room: { socket, mode },
    dispatch,
    resetTime,
  } = useRoomContext();

  const { router } = useRouter();

  const [isCreatingRoom, setIsCreatingRoom] = React.useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = React.useState(false);

  React.useEffect(() => {
    socket.emit('hi', 'hello');

    // Handle socket connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Failed to connect to server. Please try again.', {
        position: 'top-center',
        toastId: 'socket-error',
        autoClose: 5000,
      });
      setIsCreatingRoom(false);
    });

    // create another room id if already exist
    socket.off('room already exist').on('room already exist', () => {
      createRoom(socket, mode);
    });

    socket.off('end game').on('end game', () => {
      dispatch({ type: 'SET_STATUS', payload: { progress: 0, wpm: 0 } });
      dispatch({ type: 'SET_IS_READY', payload: false });
      dispatch({ type: 'SET_IS_PLAYING', payload: false });
      dispatch({ type: 'SET_IS_FINISHED', payload: false });
      dispatch({ type: 'SET_WINNER', payload: null });
      resetTime(0);
    });

    // on create room success, redirect to that room
    socket
      .off('create room success')
      .on('create room success', (roomId: string) => { 
        toast.success('Room successfully created!', {
          position: 'top-center',
          toastId: 'create-room',
          autoClose: 3000,
        });
        setIsCreatingRoom(false);
        dispatch({ type: 'SET_IS_OWNER', payload: true });
        router.push(`/multiplayer/${roomId}`);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = ({ code }: { code: string }) => {
    setIsJoiningRoom(true);
    router.push(`/multiplayer/${code}`);
  };

  return (
      
        <section>
          <div className='layout flex min-h-[65vh] w-full flex-col items-center pt-10 text-center font-primary'>
            <div className='relative mb-8 flex h-8 w-full max-w-[800px] items-center justify-between'>
              {/* <ChatBox
                className='right-3 w-[calc(100%+0.5rem)] sm:right-2'
                label='public chat'
              /> */}
            </div>
            <div className='flex w-full flex-col gap-4'>
              <Iconify icon="mdi:team" className='self-center text-[5rem] text-fg' />
              <h1 className='mb-2'>multiplayer mode</h1>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <div className='flex gap-2 w-full'>

                <RHFTextField name='code' label='Room Code' fullWidth={true} />
                <Button type='submit' disabled={isJoiningRoom} className='flex gap-1 items-center'>
              <span className='text-sm font-bold'>Go</span>
                  <Iconify icon="mdi:arrow-right" className='text-bg' />
                </Button>
                </div>
              </FormProvider>

              <span className='mb-4 text-3xl font-bold'>or</span>
              <div className='mx-auto mb-4 flex space-x-2 font-primary'>
                <Button
                  onClick={() =>
                    dispatch({ type: 'SET_MODE', payload: 'words' })
                  }
                  className={clsx(
                    "flex items-center gap-2",
                    mode !== 'words' && "bg-hl text-bg font-semibold hover:bg-hl"
                  )}
                >
                  words
                </Button>
                <Button
                  onClick={() =>
                    dispatch({ type: 'SET_MODE', payload: 'sentences' })
                  }
                  className={clsx(
                    "flex items-center gap-2",
                    mode !== 'sentences' && "bg-hl text-bg font-semibold hover:bg-hl"
                  )}
                >
                  sentences
                </Button>
                <Button
                  onClick={() =>
                    dispatch({ type: 'SET_MODE', payload: 'numbers' })
                  }
                  className={clsx(
                    "flex items-center gap-2",
                    mode !== 'numbers' && "bg-hl text-bg font-semibold hover:bg-hl"
                  )}
                >
                  numbers
                </Button>
              </div>
              <div className='flex items-center justify-center space-x-4'>
                <Button
                  onClick={() => {
                    setIsCreatingRoom(true);
                    createRoom(socket, mode);
                  }}
                  disabled={isCreatingRoom}
                  className={`${isCreatingRoom && 'cursor-not-allowed'} mb-0`}
                >
                  {isCreatingRoom ? (
                    <span className='flex items-center text-bg'>
                      Creating room
                      <Iconify icon="mdi:loading" className='ml-2 animate-spin' />
                    </span>
                  ) : (
                    'Create New Room'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section> 
  );
}
