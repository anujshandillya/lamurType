import { usePreferenceContext } from "@/context/Preference/PreferenceContext";
import useLeaderboard from "@/hooks/use-leaderboard";
import useProfile from "@/hooks/use-profile";
import clsx from "clsx";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import useTyping from "react-typing-game-hook";
import Iconify from "../Iconify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TypingInputProps = {
  text: string;
  time: string;
};

const TypingInput = forwardRef<HTMLInputElement, TypingInputProps>(
  ({ text, time }, ref) => {
    const [duration, setDuration] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const letterElements = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState(() => parseInt(time));

    const { user } = useProfile();

    const { createLeaderboardData } = useLeaderboard();

    const {
      preferences: { isOpen, zenMode, type, fontFamily, theme },
    } = usePreferenceContext();

    const {
      states: {
        charsState,
        currIndex,
        phase,
        correctChar,
        errorChar,
        startTime,
        endTime,
      },
      actions: { insertTyping, deleteTyping, resetTyping, endTyping },
    } = useTyping(text, {
      skipCurrentWordOnSpace: false,
      pauseOnError: false,
      countErrors: "everytime"
    });

    const [margin, setMargin] = useState(0);
    const [value, setValue] = useState("");

    const pos = useMemo(() => {
      if (currIndex !== -1 && letterElements.current) {
        const nextIndex = currIndex + 1;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spanref: any = letterElements.current.children[nextIndex];
        if (!spanref) {
          const lastSpan: any = letterElements.current.children[currIndex];
          if (lastSpan) {
            const left = lastSpan.offsetLeft + lastSpan.offsetWidth;
            const top = lastSpan.offsetTop - 2;
            const adjustedTop = top + (margin * 39);
            return { left, top: adjustedTop };
          }
          return { left: -2, top: 2 };
        }

        const left = spanref.offsetLeft;
        const top = spanref.offsetTop - 2;

        const adjustedTop = top + (margin * 39);

        if (adjustedTop > 60) {
          setMargin((prevMargin) => prevMargin + 1);
          return {
            left,
            top: adjustedTop / 2,
          };
        }
        return { left, top: adjustedTop };
      } else {
        return {
          left: -2,
          top: 2,
        };
      }
    }, [currIndex, margin]);

    useEffect(() => {
      setValue("");
      setMargin(0);
      setTimeLeft(parseInt(time));
      endTyping();
      resetTyping();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, time]);

    useEffect(() => {
      const timerInterval = setInterval(() => {
        if (startTime) {
          setTimeLeft((timeLeft) => {
            if (timeLeft === 1) {
              clearInterval(timerInterval);
              endTyping();
            }
            return parseInt(time) - Math.floor((Date.now() - startTime) / 1000);
          });
        }
      }, 1000);
      if (phase === 2) {
        clearInterval(timerInterval);
      }

      return () => clearInterval(timerInterval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime, phase]);

    useEffect(() => {
      if (phase === 2 && endTime && startTime) {
        const dur = Math.floor((endTime - startTime) / 1000);
        setDuration(dur);
        createLeaderboardData({
          name:
            `${user?.first_name} ${user?.last_name}` || localStorage?.getItem("nickname") || "guest",
          wpm: Math.round(((60 / dur) * correctChar) / 5),
          time: parseInt(time),
          type: type || "words",
        });
      } else {
        setDuration(0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, startTime, endTime, ref]);

    const handleKeyDown = (letter: string, control: boolean) => {
      if (letter === "Backspace") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spanref: any = letterElements?.current?.children[currIndex];
        if (!spanref) return;

        const top = spanref.offsetTop - 2;
        const adjustedTop = top + (margin * 39);

        if (adjustedTop < 0) {
          return;
        }
        deleteTyping(control);
      } else if (letter.length === 1) {
        insertTyping(letter);
      }
    };

    return (
      <TooltipProvider>
        <div className="relative w-full max-w-[950px]">
          {zenMode && (
            <div
              className={clsx(
                `pointer-events-none fixed inset-0 z-30 h-screen w-screen bg-${theme}-bg transition-opacity duration-200`,
                { "opacity-0": !isFocused }
              )}
            ></div>
          )}
          <span className={`absolute left-0 -top-[3.25rem] z-40 text-4xl text-${theme}-fg/80`}>
            {timeLeft}
          </span>

          <div
            className={clsx(
              "relative z-40 h-[140px] w-full text-2xl outline-none"
            )}
            onClick={() => {
              if (ref !== null && typeof ref !== "function") {
                ref?.current?.focus();
              }
              setIsFocused(true);
            }}
          >
            <input
              type="text"
              className="absolute left-0 top-0 z-20 h-full w-full cursor-default opacity-0"
              tabIndex={1}
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={value}
              onChange={(e) => {
                const newValue = e.target.value;
                if (value.length > newValue.length) {
                  handleKeyDown("Backspace", false);
                } else {
                  const newChar = newValue.slice(-1);
                  if (newChar.length === 1) {
                    handleKeyDown(newChar, false);
                  }
                }
                setValue(newValue);
              }}
              onKeyDown={(e) => {
                if (isOpen) {
                  setIsFocused(false);
                  return;
                }
                if (e.ctrlKey) return;
                if (
                  ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                    e.key
                  )
                )
                  e.preventDefault();
              }}
            />
            {isFocused && phase !== 2 && (
              <div
                className={`absolute z-20 h-6 pt-1 w-[2px] bg-${theme}-hl transition-all duration-150 ease-in-out`}
                style={{
                  left: `${pos.left}px`,
                  top: `${pos.top}px`,
                  backgroundColor: `var(--color-${theme}-hl)`,
                  animation: 'cursor-blink 1.2s ease-in-out infinite',
                }}
              />
            )}

            {phase === 2 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute z-30 flex cursor-pointer items-center justify-center rounded-full bg-${theme}-hl text-${theme}-bg transition-all duration-200 hover:scale-110`}
                    style={{
                      left: `${pos.left}px`,
                      top: `${pos.top}px`,
                    }}
                  >
                    <Iconify icon="mdi:flag" className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  className="z-[60] bg-primary text-primary-foreground"
                  side="top"
                  sideOffset={8}
                >
                  <p>Typing ended here</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div
              className={clsx(
                "absolute -top-4 z-10 h-4 w-full bg-gradient-to-b from-bg transition-all duration-200",
                { "opacity-0": !isFocused }
              )}
            ></div>
            <div
              className={clsx(
                "absolute -bottom-1 z-10 h-8 w-full bg-gradient-to-t from-bg transition-all duration-200",
                { "opacity-0": !isFocused }
              )}
            ></div>
            <span
              className={clsx(
                "absolute z-20 flex h-full w-full cursor-default items-center justify-center text-base opacity-0 transition-all duration-200",
                { [`text-${theme}-fg opacity-100`]: !isFocused }
              )}
            >
              Click
              <Iconify icon="mdi:cursor-default-click" />
              or press any key to focus
            </span>
            <div
              className={clsx(
                "absolute top-0 left-0 mb-4 h-full w-full overflow-hidden text-justify leading-relaxed tracking-wide transition-all duration-200",
                { "opacity-40 blur-[8px]": !isFocused }
              )}
            >
              <div
                ref={letterElements}
                style={
                  margin > 0
                    ? {
                      marginTop: -(margin * 39),
                    }
                    : {
                      marginTop: 0,
                    }
                }
              >
                {text.split("").map((letter, index) => {
                  const state = charsState[index];
                  const color =
                    state === 0
                      ? `text-${fontFamily}-font`
                      : state === 1
                        ? `text-${theme}-fg`
                        : `text-${theme}-hl border-b-2 border-${theme}-hl`;
                  return (
                    <span
                      key={letter + index}
                      className={`${color} transition-all duration-150 ease-in-out`}
                    >
                      {letter}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="relative z-40 mt-4 flex w-full flex-col flex-wrap items-center justify-center gap-4 text-sm">
            {phase === 2 && startTime && endTime ? (
              <div className="grid grid-rows-3 items-center gap-4 rounded-lg px-4 py-1 text-xl font-bold sm:flex">
                <span className="text-4xl">
                  {Math.round(((60 / duration) * correctChar) / 5)}
                  <span className="text-base">WPM</span>
                </span>{" "}
                <span className="text-4xl">
                  {duration}
                  <span className="text-2xl">s</span>
                </span>
                <span className="relative text-4xl">
                  {(((correctChar - errorChar) / (currIndex + 1)) * 100).toFixed(
                    2
                  )}
                  %
                  <span className="absolute -bottom-4 right-1 text-sm">
                    ACCURACY
                  </span>
                </span>
              </div>
            ) : null}
            <div className="flex gap-4"></div>
          </div>
        </div>
      </TooltipProvider>
    );
  }
);

export default TypingInput;