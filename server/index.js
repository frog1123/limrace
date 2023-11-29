const io = require("socket.io")(3000, {
  cors: {
    origin: "*"
  }
});

const users = new Map();

io.on("connection", socket => {
  socket.on("new-user", () => {
    console.log("new user connected");
    const newUserName = `guest-${Math.floor(Math.random() * 900000) + 100000}`;
    users.set(socket.id, newUserName);

    // console.log("users", users);

    socket.emit("user-connected", newUserName);
  });

  // socket.on("send-chat-message", message => {
  //   socket.broadcast.emit("chat-message", { message: message, name: users[socket.id] });
  // });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const disconnectedUserName = users.get(socket.id);
    users.delete(socket.id);

    io.emit("user-disconnected", disconnectedUserName);
    console.log("Updated users map after disconnect:", users);
  });
});
