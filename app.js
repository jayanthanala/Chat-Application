const express = require('express');
const app = express();
const socket = require('socket.io');
const formatMessage = require("./utils/message.js");

//css and ejs
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

//routes
app.get("/",(req,res) => {
  res.render("home");
});

app.get("/home",(req,res) => {
  res.render("chat");
});

//PORT
server = app.listen(3000,() => {
  console.log("Server started at 3000");
});

//Socket Connections
var io = socket(server);

io.on('connection',socket => {
  //Welcome Current User (Message to the connected client)
  socket.emit('message',formatMessage('Bot','Welcome to ChartCOD!'));

  //Broadcast when a user Connections (Message to all the clients already connected)
  socket.broadcast.emit('message',formatMessage('Bot','A New User has joined'));

  //(Message to all he clients using the current websocket) - io.emit()
  //When client disconnects
  socket.on('disconnect',()=>{
    io.emit('message',formatMessage('Bot','A user has left the chat'));
  })

  //listen for cgat message
  socket.on('chatmsg',(msg) => {
    io.emit('message',formatMessage('USER',msg));
  })


});
