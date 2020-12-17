const express = require('express');
const app = express();
const socket = require('socket.io');
const formatMessage = require("./utils/message.js");
const {userJoin, currentUser, userLeaves, roomtUsers, userTyping} = require("./utils/user.js");

///css and ejs
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

  socket.on('joinRoom',({username,room}) => {
    const user = userJoin(socket.id,username,room)
    socket.join(user.room);
    //Welcome Current User (Message to the connected client)//
    socket.emit('message',formatMessage('Bot','Welcome to ChartCOD!'));
    //Broadcast when a user Connections (Message to all the clients already connected)
    socket.broadcast.to(user.room).emit('message',formatMessage('Bot',`${user.username} has joined`));

    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:roomtUsers(user.room)
    });
  });


  //(Message to all he clients using the current websocket) - io.emit()
  //When client disconnects
  socket.on('disconnect',()=>{
    const user = userLeaves(socket.id);
    if(user){
        io.to(user.room).emit('message',formatMessage('Bot',`${user.username} has left the chat`));
        io.to(user.room).emit('roomUsers',{
          room:user.room,
          users:roomtUsers(user.room)
        });
    }
  });

  socket.on("typing", data => {
    const user = currentUser(socket.id);
    socket.broadcast.to(user.room).emit("notifyTyping", { message: `${user.username}`+data.message });
  });

  socket.on("stopTyping", () => {
    const user = currentUser(socket.id);
    socket.broadcast.to(user.room).emit("notifyStopTyping");
  });

  //listen for chat message
  socket.on('chatmsg',(msg) => {
    const user = currentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,msg));
  });
});
