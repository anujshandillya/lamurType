import * as React from 'react';

type BubbleProps = {
  username?: string;
  value: string;
  isYou?: boolean;
  type: 'notification' | 'message';
  theme?: string;
};

const Bubble: React.FC<BubbleProps> = ({ username, value, isYou, type, theme }) =>
  type === 'message' ? (
    isYou ? (
      <span className={`bg-white text-md mt-2 max-w-[70%] self-end rounded-lg bg-hl px-2 py-1 text-left text-sm text-${theme}-font`}>
        <span className='text-bg'>{value ?? "value"}</span>
      </span>
    ) : (
      <span className={`text-md mt-1 w-full text-left self-end rounded-lg bg-hl px-2 py-1 text-left text-${theme}-hl`}>
        <span className='text-white '>{username ?? "username"}: </span>
        {value}
      </span>
    )
  ) : (
    <span className='text-md mt-2 w-full text-center text-sm'>
      {isYou ? (
        <span className={`${value === 'joined' ? `text-${theme}-hl` : `text-${theme}-fg`}`}>
          You {value ?? "value"} the room.
        </span>
      ) : (
        <span className={`${value === 'joined' ? `text-${theme}-hl` : `text-${theme}-fg`}`}>
          {username ?? "username"} {value ?? "value"} the room.
        </span>
      )}
    </span>
  );

export default Bubble;