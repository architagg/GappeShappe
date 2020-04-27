var express = require('express'),
    app     = express(),
    PORT    = 2000|| process.env.PORT,
    path    = require('path'),
    http    = require('http'),
    socketio= require ('socket.io'),
    formatMessage = require('./utils/messages.js'),
    {userJoin,getCurrentuser,userLeave,getRoomUsers} = require('./utils/users.js');



    const server = http.createServer(app);
    const io     = socketio(server);
    const botName = 'GappeShaape Bot'

//Setting Static Folder..
    app.use(express.static(path.join(__dirname,'public')));

    
// Run when client connects
    io.on('connection',function(socket){
       socket.on('joinroom',function({username,room}){
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);
        
        //Welcome Current User to the Party 
            socket.emit('message',formatMessage(botName,'Welcome to GappeShappe!'));

        //Broadcast on User Connection
            socket.broadcast.to(user.room).emit('message',formatMessage(botName,`Welcome ${user.username} to the party!`));
        
        //Send users and room info
        io.to(user.room).emit('roomusers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
        
            
       }); 

        //Listen for Chat Message 
        socket.on('chatMessage',function(msg){
            const user = getCurrentUser(socket.id);
        io.to(user,room).emit('message',formatMessage(user.username,msg));
        });

        //Runs when client disconnects
        socket.on('disconnect',function(){
            const user =userLeave(socket.id);
            if(user){
                io.to(user.room).emit('message',formatMessage(botName,`${user.username} left the party!`));

                //Send users and room info
                io.to(user.room).emit('roomusers',{
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });
    });



server.listen (PORT,function(){
    console.log("GappeShappe is Live !")
});