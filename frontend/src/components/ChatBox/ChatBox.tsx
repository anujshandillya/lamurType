import clsx from "clsx";
import React, { useEffect } from "react";
import Bubble from "./Bubble";
import ChatInput from "./ChatInput";
import { useRouter } from "../../hooks/use-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import Iconify from "../Iconify";
import { useChatContext } from "@/context/Chat/ChatContext";
import { useRoomContext } from "@/context/Room/RoomContext";
import type { Chat } from "@/context/Chat/types";
import Button from "../shared/Button";

type ChatBoxProps = {
  className?: React.HTMLAttributes<HTMLElement>["className"];
  label?: string;
  isRoomChat?: boolean;
  theme?: string;
};

export default function ChatBox({
  className,
  label,
  isRoomChat,
  theme,
}: ChatBoxProps) {
  const {
    room: {
      isChatOpen,
      user: { id },
      socket,
    },
    dispatch,
  } = useRoomContext();

  const {
    chat: { roomChat, publicChat, onlineUsers, showNotification },
    dispatch: chatDispatch,
  } = useChatContext();

  console.log("anujanuj", roomChat);

  const { pathname } = useRouter();

  console.log("anujanuj", pathname);

  const [isPublic, setIsPublic] = React.useState(false);

  const divRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    isChatOpen &&
      chatDispatch({ type: "SET_SHOW_NOTIFICATION", payload: false });
    socket
      .off("receive chat")
      .on("receive chat", ({ id, username, value, type, roomId }: Chat) => {
        if (roomId === "public") {
          chatDispatch({
            type: "ADD_PUBLIC_CHAT",
            payload: { id, username, value, type, roomId },
          });
        } else {
          chatDispatch({
            type: "ADD_ROOM_CHAT",
            payload: { id, username, value, type, roomId },
          });
        }
        if (!isChatOpen)
          chatDispatch({ type: "SET_SHOW_NOTIFICATION", payload: true });
      });
  }, [chatDispatch, isChatOpen, socket]);

  useEffect(() => {
    if (divRef.current && isChatOpen) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [roomChat, publicChat, isChatOpen, isPublic]);

  return (
    <div
      className={clsx(
        `flex h-full w-full min-w-[280px] max-w-full flex-col overflow-hidden rounded-lg border border-fg bg-${theme}-bg`,
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-fg px-4 py-2">
        <span className={`text-sm font-semibold text-${theme}-fg`}>
          {isPublic ? 'Public' : 'Room'} Chat
        </span>
        {isRoomChat && (
          <span className={`text-xs text-${theme}-fg/50`}>
            {onlineUsers} online
          </span>
        )}
        <Button onClick={() => setIsPublic((isPublic) => !isPublic)}
        >
          Switch to {isPublic ? 'Room' : 'Public'} Chat
        </Button>
      </div>
      <div
        ref={divRef}
        className="xs:scrollbar flex h-full w-full flex-col overflow-y-auto break-words py-2 px-4 sm:px-6"
      >
        {(isPublic || ['/multiplayer', '/'].includes(pathname)) &&
          publicChat.map((chat, index) =>
            chat.id === id ? (
              <Bubble
                type={chat.type}
                key={index}
                isYou
                value={chat.value}
              />
            ) : (
              <Bubble
                type={chat.type}
                key={index}
                username={chat.username}
                value={chat.value}
              />
            )
          )}
        {!isPublic &&
          isRoomChat &&
          roomChat.map((chat, index) =>
            chat.id === id ? (
              <Bubble
                type={chat.type}
                key={index}
                isYou
                value={chat.value}
              />
            ) : (
              <Bubble
                type={chat.type}
                key={index}
                username={chat.username}
                value={chat.value}
              />
            )
          )}
        {/* {showNotification && (
          <Bubble
            type="notification"
            value={isPublic ? "joined" : "left"}
            isYou={true}
            theme={theme}
          />
        )} */}
      </div>
      <ChatInput isPublic={
        ['/multiplayer', '/'].includes(pathname) ? true : isPublic
      } />
    </div>
  );
}
