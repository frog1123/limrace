const socketIO = require("socket.io");
const generateRandomParagraph = require("../utils/generate-text");

const users = new Map();
const rooms = new Map();

const setupSocketIO = (server, port) => {
  const io = socketIO(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", socket => {
    console.log(`socket server running on port ${port}`);

    socket.on("join-room", room => {
      const text = generateRandomParagraph();

      // create room
      if (!rooms.has(room)) {
        rooms.set(room, {
          text
        });
      }

      // join the specified room
      socket.join(room);

      // generate a random username for the user
      const newUserName = `guest-${Math.floor(Math.random() * 900000) + 100000}`;
      users.set(socket.id, { name: newUserName, room });

      // emit a message to the user with their details
      socket.emit("user-connected", {
        name: newUserName,
        users: getOtherUsersInRoom(room, socket.id),
        room: {
          id: room,
          text: rooms.get(room).text
        }
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

    socket.on("word-completed", data => {
      const user = users.get(socket.id);

      console.log(data, user);

      socket.to(user.room).emit("broadcasted-word-completed", { name: user.name, char: data.char });
    });
  });
};

function getOtherUsersInRoom(room, currentUserId) {
  return Array.from(users.values())
    .filter(user => user.room === room && user.socketId !== currentUserId)
    .map(user => ({ name: user.name }));
}

module.exports = setupSocketIO;
