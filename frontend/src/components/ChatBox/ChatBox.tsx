import clsx from "clsx";
import React, { useEffect } from "react";
import Bubble from "./Bubble";
import ChatInput from "./ChatInput";
import { useRouter } from "../../hooks/use-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import Iconify from "../Iconify";

type ChatBoxProps = {
  className?: React.HTMLAttributes<HTMLElement>["className"];
  label?: string;
  isRoomChat?: boolean;
  theme?: string;
};

// import { useChatContext } from '@/context/Chat/ChatContext';
// import { Chat } from '@/context/Chat/types';
// import { useRoomContext } from '@/context/Room/RoomContext';

export default function ChatBox({
  className,
  label,
  isRoomChat,
  theme
}: ChatBoxProps) {
  //   const {
  //     room: {
  //       isChatOpen,
  //       user: { id },
  //       socket,
  //     },
  //     dispatch,
  //   } = useRoomContext();

  //   const {
  //     chat: { roomChat, publicChat, onlineUsers, showNotification },
  //     dispatch: chatDispatch,
  //   } = useChatContext();

  // These should be replaced with the actual state from context or props
  const isChatOpen = true;
  const id = "1"; // Example user ID
  const roomChat = [
    {
      id: "1",
      username: "User1",
      value: "Hello everyone!",
      type: "message",
      roomId: "public",
    },
    {
      id: "2",
      username: "User2",
      value: "Hi User1!",
      type: "message",
      roomId: "public",
    },
  ];
  const publicChat = [
    {
      id: "1",
      username: "User1",
      value: "Hello everyone!",
      type: "message",
      roomId: "public",
    },
    {
      id: "2",
      username: "User2",
      value: "Hi User1!",
      type: "message",
      roomId: "public",
    },
  ];
  const onlineUsers = 1;
  const showNotification = true;

  const { pathname } = useRouter();

  const [isPublic, setIsPublic] = React.useState(false);

  const divRef = React.useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     isChatOpen &&
  //       chatDispatch({ type: 'SET_SHOW_NOTIFICATION', payload: false });
  //     socket
  //       .off('receive chat')
  //       .on('receive chat', ({ id, username, value, type, roomId }: Chat) => {
  //         if (roomId === 'public') {
  //           chatDispatch({
  //             type: 'ADD_PUBLIC_CHAT',
  //             payload: { id, username, value, type, roomId },
  //           });
  //         } else {
  //           chatDispatch({
  //             type: 'ADD_ROOM_CHAT',
  //             payload: { id, username, value, type, roomId },
  //           });
  //         }
  //         if (!isChatOpen)
  //           chatDispatch({ type: 'SET_SHOW_NOTIFICATION', payload: true });
  //       });
  //   }, [chatDispatch, isChatOpen, socket]);

  //   React.useEffect(() => {
  //     if (divRef.current && isChatOpen) {
  //       divRef.current.scrollTop = divRef.current.scrollHeight;
  //     }
  //   }, [roomChat, publicChat, isChatOpen, isPublic]);

  return (
    <div
      className={clsx(
        `flex h-full w-full min-w-[350px] md:min-w-[450px] lg:min-w-[550px] flex-col overflow-hidden rounded-lg border border-fg bg-${theme}-bg`,
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-fg px-4 py-2">
        <span className={`text-sm font-semibold text-${theme}-fg`}>{label}</span>
        {isRoomChat && (
          <span className={`text-xs text-${theme}-fg/50`}>{onlineUsers} online</span>
        )}
      </div>
      <div
        ref={divRef}
        className="xs:scrollbar flex h-full w-full flex-col overflow-y-auto break-words py-2 px-4 sm:px-6"
      >
        {(isPublic ? publicChat : roomChat).map((chat) => (
          <Bubble
            key={chat.id}
            username={chat.username}
            value={chat.value}
            isYou={chat.id === id}
            type={chat.type === "notification" ? "notification" : "message"}
            theme={theme}
          />
        ))}
        {showNotification && (
          <Bubble
            type="notification"
            value={isPublic ? "joined" : "left"}
            isYou={true}
            theme={theme}
          />
        )}
      </div>
      <ChatInput isPublic={isPublic} />
    </div>
  );
}
