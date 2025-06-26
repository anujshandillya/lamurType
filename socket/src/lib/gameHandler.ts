import { Socket } from "socket.io";
import { io, rooms } from "..";
import { shuffleList } from "./functions";

export const endGameHander = (socket: Socket) => {
	socket.on("end game", (roomId: string, mode: "words" | "sentences" | "numbers") => {
		if (!rooms[roomId]) return;
		
		const toType = shuffleList(mode).join(" ");
		rooms[roomId] = {
			players: rooms[roomId].players,
			toType,
			inGame: false,
			winner: socket.id,
		};
		// console.log(socket.id);
		// io.in(roomId).emit("winner", rooms[roomId].winner);
		io.in(roomId).emit("end game", socket.id);
	});
};

export const startGameHander = (socket: Socket) => {
	socket.on("start game", (roomId: string) => {
		if (!rooms[roomId]) return;
		
		rooms[roomId].inGame = true;
		rooms[roomId].winner = null;
		
		io.in(roomId).emit("words generated", rooms[roomId].toType);
		io.in(roomId).emit("start game");
	});
};