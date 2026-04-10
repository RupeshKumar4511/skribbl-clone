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


io.on('connection',(socket)=>{
    console.log("User Connected ")
    console.log(socket.id);

    socket.on('message',(data)=>{
        console.log(data)
    })   
    
    socket.on('disconnect',()=>{
        console.log("user disconnected")
    })
})


export default server;