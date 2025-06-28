import { toast } from "react-toastify";
import Multiplayer from "@/components/Multiplayer/Multiplayer";

import { useChatContext } from "@/context/Chat/ChatContext";
import { useRoomContext } from "@/context/Room/RoomContext";
import type { Player } from "@/context/Room/types";
import { useRouter, useParams } from "@/hooks/use-router";
import { useEffect } from "react";
import Keyboard from "@/components/Keyboard";

export default function MultiplayerPageID() {
  const {
    room: { socket, user },
    dispatch,
    resetTime,
  } = useRoomContext();

  const { dispatch: chatDispatch } = useChatContext();

  const { router } = useRouter();
  const params = useParams();

  useEffect(() => {
    if (user.id && params.id) {
      socket.off("room update");
      socket.off("start game");
      socket.off("end game");
      socket.off("room invalid");
      socket.off("room in game");
      socket.off("words generated");
      socket.off("connect_error");

      socket.emit("join room", { roomId: params.id, user });
      dispatch({ type: "SET_ROOM_ID", payload: params.id as string });
      chatDispatch({ type: "CLEAR_ROOM_CHAT" });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error in room:", error);
        toast.error("Failed to connect to server. Please try again.", {
          position: "top-center",
          toastId: "socket-error-room",
          autoClose: 5000,
        });
      });

      socket.on("room update", (players: Player[]) => {
        const uniquePlayers = players.filter(
          (player, index, self) =>
            index === self.findIndex((p) => p.id === player.id)
        );

        dispatch({ type: "SET_PLAYERS", payload: uniquePlayers });
      });

      socket.on("start game", () => {
        dispatch({ type: "SET_STATUS", payload: { progress: 0, wpm: 0 } });
        dispatch({ type: "SET_IS_FINISHED", payload: false });
        dispatch({ type: "SET_WINNER", payload: null });
        resetTime(5).then(() =>
          dispatch({ type: "SET_IS_READY", payload: true })
        );
      });

      dispatch({ type: "SET_STATUS", payload: { progress: 0, wpm: 0 } });
      dispatch({ type: "SET_IS_READY", payload: false });
      dispatch({ type: "SET_IS_PLAYING", payload: false });
      dispatch({ type: "SET_IS_FINISHED", payload: false });
      dispatch({ type: "SET_WINNER", payload: null });
      resetTime(0);

      socket.on("end game", (playerId: string) => {
        dispatch({ type: "SET_IS_PLAYING", payload: false });
        dispatch({ type: "SET_WINNER", payload: playerId });
        dispatch({ type: "SET_IS_READY", payload: false });
      });

      socket.on("room invalid", () => {
        toast.error("Room doesn't exist.", {
          position: "top-center",
          toastId: "Room doesn't exist.",
          autoClose: 3000,
        });
        router.push("/multiplayer");
      });

      socket.on("room in game", () => {
        toast.error("Room is currently in game.", {
          position: "top-center",
          toastId: "Room is currently in game.",
          autoClose: 3000,
        });
        router.push("/multiplayer");
      });

      socket.on("words generated", (text: string) => {
        dispatch({ type: "SET_TEXT", payload: text });
      });

      return () => {
        socket.off("room update");
        socket.off("start game");
        socket.off("end game");
        socket.off("room invalid");
        socket.off("room in game");
        socket.off("words generated");
        socket.off("connect_error");
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, user.id]);

  return (
    <>
        <Multiplayer />

        <div className="mt-8 flex flex-col items-center justify-center gap-2 font-primary">
          <div className="flex items-center space-x-2 text-sm">
            <Keyboard>tab</Keyboard>
            <span className="text-hl"> + </span>
            <Keyboard>enter</Keyboard>
            <span className="text-hl"> - ready / cancel </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Keyboard>ctrl/cmd</Keyboard>
            <span className="text-hl"> + </span>
            <Keyboard>k</Keyboard>
            <span className="text-hl"> or </span>
            <Keyboard>p</Keyboard>
            <span className="text-hl"> - command palette </span>
        </div>
      </div>
    </>
    
  );
}
