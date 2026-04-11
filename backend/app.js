import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors';
import client from './config/client.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))


io.on('connection', (socket) => {
    console.log("User Connected ")
    console.log(socket.id);

    socket.on('draw_start', (data) => {
        console.log("draw_start")
        socket.broadcast.emit('draw_start', data)
    })
    socket.on('draw_move', (data) => {
        console.log("draw_move")
        socket.broadcast.emit('draw_move', data)
    })

    socket.on('chat', (data) => {
        socket.broadcast.emit('chat', data)
    })
    socket.on('create_room', async (data) => {

        const roomId = data.roomId || `room-${socket.id}`;

        const roomData = JSON.stringify({
            roomId: roomId,
            hostname: data.name,
            createdAt: new Date().toISOString()
        });

        try {
            const created = await client.set(roomId, roomData, {
                NX: true,
                EX: 600
            });

            if (created) {
                socket.join(roomId);
                console.log(`Room created: ${roomId} by ${data.name}`);
                socket.emit('room_created', { roomId });
            } else {
                // Room ID was already taken
                socket.emit('error', { message: 'Room ID already in use.' });
            }
        } catch (err) {
            console.error("Redis Error:", err);
            socket.emit('error', { message: 'Failed to create room.' });
        }
    });


    socket.on('join_room', (data) => {
        const roomId = data.roomId || `room-${socket.id}`;

        // Actually join the room
        socket.join(roomId);

        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    })

    socket.on('disconnect', () => {
        console.log("user disconnected")
    })
})


export default server;