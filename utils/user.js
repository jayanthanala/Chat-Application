const users = [];

//Join user to chat
function userJoin(id,username,room){
  const user = {id,username,room};
  users.push(user);
  return user;
}

//get current user
function currentUser(id){
  return users.find(user => user.id == id);
}

function userLeaves(id){
  const index = users.findIndex(user => user.id == id);
  if(index !== -1){
    return users.splice(index,1)[0];
  }
}

function roomtUsers(room){
  return users.filter(user => user.room == room);
}

function userTyping(id){
  return user.find(user => user.id == id);
}

module.exports = {userJoin, currentUser, userLeaves, roomtUsers};
