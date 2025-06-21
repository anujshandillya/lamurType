import React, { useEffect } from 'react'
import Button from '../components/Button'
import { useRouter } from '../hooks/use-router'
import Iconify from '../components/Iconify'
import Keyboard from '../components/Keyboard'
import ChatBox from '../components/ChatBox/ChatBox'
import Drawer from '../components/Drawer'
import { useBoolean } from '../hooks/use-boolean'

const Home = () => {
  const { router } = useRouter()
  const drawer = useBoolean(false)

  useEffect(() => {
    console.log('Drawer state changed:', drawer.value)
  }, [drawer.value])

  return (
    <section>
      <Button onClick={drawer.onTrue} className='fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-white shadow-lg hover:bg-fg/90 transition-colors duration-200'>
        <Iconify icon="mdi:chat" />
      </Button>
          <div className='layout flex flex-col items-center gap-8 pt-8 text-center'>
            <Drawer open={drawer.value} onClose={drawer.onFalse} position='right' size='md' title='Chat'>
              <ChatBox
                className='h-[80vh] w-full max-w-[400px]'
                label='Public Chat'
              />
            </Drawer>

            <div className='aspect-video w-full max-w-[450px] overflow-hidden rounded-lg ring-4 ring-fg ring-offset-4 ring-offset-bg'>
              <iframe
                src='https://www.youtube.com/embed/nnM9h7twXg8?autoplay=1&mute=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=nnM9h7twXg8'
                title='Monkeytype Clone'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                style={{
                  width: '300%',
                  height: '100%',
                  marginLeft: '-100%',
                  zIndex: 50,
                }}
              ></iframe>
            </div>
            {/* <FormProvider {...methods}>
              <Input
                placeholder='enter your nickname'
                autoComplete='off'
                name='nickname'
                id='nickname'
                maxLength={14}
                defaultValue={localStorage?.getItem('nickname') || ''}
                onBlur={(e) => {
                  if (!e.target.value) return;
                  dispatch({ type: 'SET_NICKNAME', payload: e.target.value });
                }}
                className='text-center'
              />
            </FormProvider> */}
            <div className='flex items-center gap-4'>
              <Button
                onClick={() => router.push('/solo')}
                className='flex items-center gap-2'
              >
                <Iconify icon="mdi:account" />
                Play Solo
              </Button>
              <div>
                <Button
                  onClick={() => router.push('/multiplayer')}
                  className='flex items-center gap-2'
                >
                  <Iconify icon="mdi:account-multiple" />
                  Multiplayer
                </Button>
              </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-2 font-primary'>
              <div className='flex items-center space-x-2 text-sm'>
                <Keyboard className='bg-white'>tab</Keyboard>
                <span className='text-hl'> + </span>
                <Keyboard className='bg-white'>enter</Keyboard>
                <span className='text-hl'> - restart test </span>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <Keyboard className='bg-white'>ctrl/cmd</Keyboard>
                <span className='text-hl'> + </span>
                <Keyboard className='bg-white'>k</Keyboard>
                <span className='text-hl'> or </span>
                <Keyboard className='bg-white'>p</Keyboard>
                <span className='text-hl'> - command palette </span>
              </div>
            </div>
          </div>
        </section>
  )
}

export default Home