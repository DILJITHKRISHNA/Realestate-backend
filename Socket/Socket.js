import io from 'socket.io';


const Io = new io(server, {
    cors: {
        origin: "http://localhost:5000",

    }
})

let activeUsers = []
Io.on('connection', (socket) => {
    //add new user
    socket.on('new-user-add', (newUserId)=>{
        //if user is not added successfully
        if(!activeUsers.some((user)=>user.userId === newUserId)){
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        console.log("Connected Users", activeUsers);
        Io.emit('get-users', activeUsers)
    })

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user)=> user.socketId !== socket.id)
        console.log("User Disconnected", activeUsers);

        Io.emit('get-users', activeUsers)
    })
})