import { Socket } from "socket.io";
import { io, playerRooms, rooms } from "..";
import { Player } from "./types";
import { shuffleList } from "./functions";

export const createRoomHandler = (socket: Socket) => {
	socket.on("create room", (roomId: string, mode: "words" | "sentences" | "numbers") => {
		
		if (io.sockets.adapter.rooms.get(roomId)) {
			
			socket.emit("room already exist");
		} else {
			const toType = shuffleList(mode).join(" ");
			rooms[roomId] = {
				players: [],
				toType,
				inGame: false,
				winner: null,
			};

			socket.join(roomId);
			playerRooms[socket.id] = [roomId];

			
			socket.emit("words generated", rooms[roomId].toType);
			socket.emit("create room success", roomId);
		}
	});
};

export const updateRoomHandler = (socket: Socket) => {
	socket.on("room update", (user: Player) => {
		
		const { roomId } = user;
		if (!rooms[roomId]) {
			
			return;
		}
		
		
		const playerIndex = rooms[roomId].players.findIndex(player => player.id === user.id);
		
		
		if (playerIndex !== -1) {			
			rooms[roomId].players[playerIndex] = user;
		} else {
			rooms[roomId].players.push(user);
		}
		
		io.in(roomId).emit("room update", rooms[roomId].players);
	});
};

export const joinRoomHander = (socket: Socket) => {
	socket.on("join room", ({ roomId, user }: { roomId: string; user: Player }) => {
		
		const room = rooms[roomId];
		if (!room) {
			
			socket.emit("room invalid");
			return;
		} else if (rooms[roomId].inGame) {
			
			socket.emit("room in game");
			return;
		} else {
			const existingPlayerIndex = rooms[roomId].players.findIndex(player => player.id === user.id);	
			
			if (existingPlayerIndex === -1) {
				rooms[roomId].players = [...rooms[roomId].players, user];
				
			} else {
				rooms[roomId].players[existingPlayerIndex] = user;
			}
			playerRooms[socket.id] = [roomId];
		}

		socket.join(roomId);
		
		socket.emit("words generated", rooms[roomId].toType);
		io.in(roomId).emit("room update", rooms[roomId].players);
		io.in(roomId).emit("receive chat", { username: user.username, value: "joined", id: user.id, type: "notification" });
	});
};

export const leaveRoomHandler = (socket: Socket) => {
	socket.on("leave room", (user: Player) => {
		const { roomId } = user;
		const players = rooms[roomId];
		if (!players) return;
		rooms[roomId].players = players.players.filter((player) => {
			if (player.id === user.id) {
				io.in(roomId).emit("receive chat", { username: player.username, value: "left", id: player.id });
			}
			return player.id !== user.id;
		});

		io.in(roomId).emit("room update", rooms[roomId].players);
		if (rooms[roomId].players.length === 0) {
			delete rooms[roomId];
		}
	});
};