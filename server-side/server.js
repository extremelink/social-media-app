const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const cors=require('cors');
const morgan = require('morgan');
require('dotenv').config();



const allowedOrigins = [
    process.env.CLIENT_URL,  // For local development
    process.env.DEPLOYED_URL // For production
];

const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http,{
    cors:{
        origin:allowedOrigins,
        methods:["GET","POST"],
        allowedHeaders:["Content-type"]
    }
})

const port=process.env.PORT;

mongoose.connect(process.env.DATABASE)
.then(()=>console.log('DB connection made!!'))
.catch(e=>console.log('DB error=> ',e));

// to receive data from client to server 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:allowedOrigins
}))

//autoload routes
const read = fs.readdirSync('./routes').map(r=>app.use('/api/',require(`./routes/${r}`)));

io.on('connect',(socket)=>{
    console.log('socektio',socket.id)
    socket.on('new-post',(newPost)=>{
        console.log("socketio new post",newPost);
        // socket.broadcast.emit("new-post",newPost);
        socket.broadcast.emit("new-post",newPost);
    })
});

http.listen(port,()=>{
console.log(`server is running on http://localhost:${port}`);
})
