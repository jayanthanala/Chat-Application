const chatForm = $("#chat-form");
const chatMessages = document.querySelector(".chat-messages")

//Get Username from room from url
const{ username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true});


const socket = io();

socket.on('message',msg => {
  console.log(msg);
  outputMessage(msg);
})

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

//Output message to DOM

function outputMessage(message){
  const div = document.createElement("div");
  div.classList.add('message');
  div.innerHTML = '<p class="meta">'+message.username +' <span>'+message.time+'</span></p> <p class="text">'+message.text+'</p>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
