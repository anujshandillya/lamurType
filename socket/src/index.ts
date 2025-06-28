import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PlayerState, RoomState, SendChat } from "./lib/types";
import { createRoomHandler, joinRoomHander, leaveRoomHandler, updateRoomHandler } from "./lib/roomHandler";
import { disconnectHandler } from "./lib/disconnectHandler";
import { endGameHander, startGameHander } from "./lib/gameHandler";
import dotenv from "dotenv";
dotenv.config();

const port = 4000;
const app = express();
app.use(cors());

const server = http.createServer(app);
export const io = new Server(server, {
	cors: {
		origin: [
			"http://localhost:5173",
		],
		methods: ["GET", "POST"],
	},
});

export const playerRooms: PlayerState = {};

export const rooms: RoomState = {};

io.on("connection", (socket) => {
	socket.join("public");
	const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
	io.to("public").emit("online users", sockets.length);

	socket.on("get online users", () => {
		const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
		io.to("public").emit("online users", sockets.length);
	});

	socket.on("send chat", ({ username, value, roomId, id }: SendChat) => {
		console.log(roomId);
		io.to(roomId).emit("receive chat", { username, value, id, type: "message", roomId });
	});

	disconnectHandler(socket);

	startGameHander(socket);
	endGameHander(socket);

	joinRoomHander(socket);
	leaveRoomHandler(socket);
	createRoomHandler(socket);
	updateRoomHandler(socket);
});

server.listen(port, () => {
	console.log(`Listening to server on port ${port}`);
});