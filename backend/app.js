import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors';

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


const rooms = {};
io.on('connection', (socket) => {
    console.log("User Connected ")
    console.log(socket.id);

    

    socket.on('draw_start', (data) => {
        const { roomId } = data;
        const room = rooms[roomId];

        if (room && socket.id === room.artistId) {
            socket.to(roomId).emit('draw_start', data);
        }

    })

    socket.on('draw_move', (data) => {
        const { roomId } = data;
        const room = rooms[roomId];

        if (room && socket.id === room.artistId) {
            socket.to(roomId).emit('draw_move', data);
        }
    })

    socket.on('chat', (data) => {
        const { roomId } = data;
        const room = rooms[roomId];

        if (room) {
            socket.to(roomId).emit('chat', data);
        }
    })


    socket.on('create_room', async (data) => {
        const { roomId = `room-${socket.id}`, username } = data;

        // 1. Optional: Leave other rooms first (except the default private room)
        socket.rooms.forEach((room) => {
            if (room !== socket.id) socket.leave(room);
        });

        // Join the new room
        await socket.join(roomId);

        // Update internal room state
        if (!rooms[roomId]) rooms[roomId] = { players: [] , artistId: socket.id};

        

        // Acknowledge creation to the sender
        socket.emit('room_created', { roomId });

        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });



    socket.on('join_room', (data) => {
        const { roomId, username } = data;
        socket.join(roomId);

        // Initialize room if it doesn't exist
        if (!rooms[roomId]) {
            rooms[roomId] = { players: [], artistId: socket.id }; // First person is artist
        }

        // Add player to the list
        const newUser = { id: socket.id, name: username || `Player ${socket.id.slice(0, 4)}` };
        rooms[roomId].players.push(newUser);

        // Notify everyone in the room to update their PlayerList
        io.to(roomId).emit('update_player_list', rooms[roomId].players);

        // Tell the client who the current artist is
        io.to(roomId).emit('artist_assigned', rooms[roomId].artistId);
    });

    socket.on('disconnect', () => {
        // Find which rooms the user was in and remove them
        for (const roomId of socket.rooms) {
            if (rooms[roomId]) {
                rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
                io.to(roomId).emit('update_player_list', rooms[roomId].players);

                // If artist left, assign a new one
                if (rooms[roomId].artistId === socket.id && rooms[roomId].players.length > 0) {
                    rooms[roomId].artistId = rooms[roomId].players[0].id;
                    io.to(roomId).emit('artist_assigned', rooms[roomId].artistId);
                }
            }
        }
    });
})


export default server;