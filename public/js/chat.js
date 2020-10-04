const chatForm = $("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
var userList = document.getElementById("users");
var roomName = document.getElementById("room-name");
var typing = false;
var timeout = undefined;



//Get Username from room from url
const{ username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true});


const socket = io();

//Join Chatroom
socket.emit('joinRoom',{username, room});

socket.on('message',msg => {
  console.log(msg);
  outputMessage(msg);
});

socket.on('roomUsers',({room,users}) => {
  roomName.innerHTML = room;
  userList.innerHTML = users.map(user => "<li>"+user.username+"</li>").join('');
});

//Message Submit
chatForm[0].addEventListener('submit',(e) => {
  e.preventDefault();
  const msg = $("#msg").val();
  //emit message to server
  socket.emit('chatmsg',msg);

  //clearing input feild
  $("#msg").val('');
  $("#msg").focus();
});

//Typing message
chatForm[0].addEventListener('keydown',(e) => {
  socket.emit('usertype',typemsg);
});

function onKeyDownNotEnter(){
  if(typing == false) {
    typing = true
    socket.emit(typingMessage);
    timeout = setTimeout(timeoutFunction, 5000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 5000);
  }
}

//Output message to DOM
function outputMessage(message){
  const div = document.createElement("div");
  div.classList.add('message');
  div.innerHTML = '<p class="meta">'+message.username +' <span>'+message.time+'</span></p> <p class="text">'+message.text+'</p>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function timeoutFunction(){
  typing = false;
  socket.emit(noLongerTypingMessage);
}
