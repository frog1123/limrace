const socketIO = require("socket.io");

const users = new Map();

const setupSocketIO = (server, port) => {
  const io = socketIO(server);

  io.on("connection", socket => {
    console.log(`socket server running on port ${port}`);

    socket.on("join-room", room => {
      // join the specified room
      socket.join(room);

      // generate a random username for the user
      const newUserName = `guest-${Math.floor(Math.random() * 900000) + 100000}`;
      users.set(socket.id, { name: newUserName, room });

      // emit a message to the user with their details
      socket.emit("user-connected", {
        name: newUserName,
        room,
        users: getOtherUsersInRoom(room, socket.id)
      });

      socket.to(room).emit("broadcasted-user-connected", { name: newUserName });

      console.log("[new user connected]", newUserName);
    });

    socket.on("disconnect", () => {
      const user = users.get(socket.id);

      if (user) {
        console.log("[user disconnected]", user.name);

        // broadcast to all users in the room that a user has disconnected
        socket.to(user.room).emit("broadcasted-user-disconnected", { name: user.name });

        users.delete(socket.id);
      }
    });
  });
};

function getOtherUsersInRoom(room, currentUserId) {
  return Array.from(users.values())
    .filter(user => user.room === room && user.socketId !== currentUserId)
    .map(user => ({ name: user.name }));
}

module.exports = setupSocketIO;
