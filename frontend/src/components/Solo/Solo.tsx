import { usePreferenceContext } from '@/context/Preference/PreferenceContext';
import { useEffect, useRef, useState } from 'react';
import { shuffleList } from './functions';
import TypingInput from './TypingInput';
import Iconify from '../Iconify';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Button from '../shared/Button';

export default function Solo() {
  const {
    preferences: { type, time, isOpen, theme },
  } = usePreferenceContext();

  const [list, setList] = useState<string[]>(() => shuffleList(type));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isOpen) return;
      if (event.key === 'tab' && buttonRef.current !== null) {
        buttonRef.current.focus();
      } else if (event.key !== 'Enter' && inputRef.current !== null) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setList(shuffleList(type));
  }, [type]);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {/* Box */}
      <TypingInput ref={inputRef} text={list.join(' ')} time={time} />

      {/* Restart Button */}
      <Button
        onClick={() => {
            if(inputRef.current !== null) {
                inputRef.current.focus();
                setList(shuffleList(type));
            }
        }}
        ref={buttonRef}
        tabIndex={2}
        className={`group relative z-40 mt-2 flex items-center rounded-lg border-0 px-4 py-2 text-${theme}-fg/50 outline-none transition-colors duration-200 hover:text-${theme}-fg focus:bg-hl focus:text-bg active:bg-hl active:text-bg`}
      >
        <Tooltip>
            <TooltipTrigger>
        <Iconify icon="mdi:restart" className='text-2xl' />

            </TooltipTrigger>
            <TooltipContent className='top-12 font-primary group-hover:translate-y-0 group-hover:opacity-100 group-focus:top-14 group-focus:translate-y-0 group-focus:opacity-100 group-active:top-14 group-active:translate-y-0 group-active:opacity-100'>
            Restart Test
            </TooltipContent>
        </Tooltip>

      </Button>
    </>
  );
}
