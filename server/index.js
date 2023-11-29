const io = require("socket.io")(3000, {
  cors: {
    origin: "*"
  }
});

const users = new Map();

io.on("connection", socket => {
  socket.on("new-user-connected", () => {
    const newUserName = `guest-${Math.floor(Math.random() * 900000) + 100000}`;
    users.set(socket.id, newUserName);

    socket.emit("user-connected", {
      name: newUserName,
      otherUsers: Array.from(users.values()).filter(username => username !== newUserName)
    });

    socket.broadcast.emit("broadcasted-user-connected", newUserName);
    console.log("[new user connected]", newUserName);
  });

  // socket.on("send-chat-message", message => {
  //   socket.broadcast.emit("chat-message", { message: message, name: users[socket.id] });
  // });

  socket.on("disconnect", () => {
    console.log("[user disconnected]", users.get(socket.id));

    const disconnectedUserName = users.get(socket.id);
    users.delete(socket.id);

    io.emit("user-disconnected", disconnectedUserName);
  });
});
