const io = require("socket.io")(3000, {
  cors: {
    origin: "*"
  }
});

const users = {};

io.on("connection", socket => {
  socket.on("new-user", name => {
    console.log("new user connected");
    console.log("users", users);
    users[socket.id] = name;
    socket.emit("user-connected", name);
  });

  socket.on("send-chat-message", message => {
    socket.broadcast.emit("chat-message", { message: message, name: users[socket.id] });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
