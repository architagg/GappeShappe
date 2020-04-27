const chatForm = document.getElementById('chat-form');
const chatMessages  = document.querySelector('.chat-messages');
const roomname =document.getElementById('room-name');
const userList =document.getElementById('users');


//Get Username and Room
const{username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});


const socket = io();

//Join Chatroom
socket.emit('joinroom',{username,room});

//Get room and users
socket.on('roomusers',function({room,users}){
    outputRoomName(room);
    outputUsers(users);
});



//MEssage from Server
socket.on('message',function(message){
    console.log(message);  
    outputMessage(message);


    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message Submit
chatForm.addEventListener('submit',function(e){
    e.preventDefault(); //Prevent Default Behaviour

    //Get message text
    const msg = e.target.elements.msg.value;
    //Emit message to Server
    socket.emit('chatMessage',msg);

    //Clear Input Bar
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();
});

//Output Message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p> <p class="text"> ${message.text} </p>` ;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add Room name to DOM
function outputRoomName(room){
    roomname.innerText = room;
};

function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join()}`;
};