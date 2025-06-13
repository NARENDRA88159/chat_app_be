const express = require('express');
const dotenv = require('dotenv');
const cors =require("cors")
dotenv.config();
const connectToDB = require("./db")
const { Server } = require('socket.io');
connectToDB();
const app = express();
const swaggerUi  = require("swagger-ui-express");
const swaggerDocs = require("./swagger-output.json"); // Import the generated Swagger JSON
const UserRoute = require("./Route/UserRoute")
const UserMessageRoute=require("./Route/UserMessagesRoute")

const PORT = process.env.PORT || 3000; // default port fallback
const http = require('http');
const server = http.createServer(app);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const multer = require('multer');

app.use("/api/user", UserRoute)
app.use("/api/userMessage", UserMessageRoute)

const io = new Server(server, {
  cors: {
    origin: '*', // adjust this to your frontend origin
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for incoming messages
  socket.on('message', (data) => {
    console.log('Received message:', data);

    // Broadcast message to all clients (including sender)
    io.emit('message', data);
  });

  socket.on("UpdateMessage", (data) => {
    io.emit('UpdateMessage', data);
  })

  socket.on("DeleteMessage", (data) => {
    io.emit('DeleteMessage', data);
  })
  socket.on("SendAudioMessage", (data) => {
    io.emit('SendAudioMessage', data);
  })


  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});





server.listen(PORT, () => {
  console.log(`🚀 Server started on port: ${PORT}`);
});
