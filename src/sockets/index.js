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

    socket.on("create-room", () => {
      let roomId;
      do {
        roomId = Math.floor(100000 + Math.random() * 900000);
      } while (rooms.has(roomId));
      const text = generateRandomParagraph();

      rooms.set(roomId.toString(), { text });

      socket.emit("room-created", roomId);
    });

    socket.on("join-room", roomId => {
      // create room (needs to be int)
      if (!rooms.has(roomId)) {
        socket.emit("room-not-found");
        return;
      }

      // join the specified room
      socket.join(roomId);

      // generate a random username for the user
      let newUserName;
      do {
        newUserName = `guest-${Math.floor(Math.random() * 900000) + 100000}`;
      } while (isUserNameTaken(newUserName));
      users.set(newUserName, { name: newUserName, room: roomId });

      console.log(users, getOtherUsersInRoom(roomId, socket.id));

      // emit a message to the user with their details
      socket.emit("user-connected", {
        name: newUserName,
        users: getOtherUsersInRoom(roomId, socket.id),
        room: {
          id: roomId,
          text: rooms.get(roomId).text
        }
      });

      socket.to(roomId).emit("broadcasted-user-connected", { name: newUserName });

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

      socket.to(user.room).emit("broadcasted-word-completed", { name: user.name, char: data.char });
    });
  });
};

const getOtherUsersInRoom = (room, currentUserId) => {
  return Array.from(users.values())
    .filter(user => user.room === room && user.socketId !== currentUserId)
    .map(user => ({ name: user.name }));
};

const isUserNameTaken = username => {
  return Array.from(users.values()).some(user => user.name === username);
};

module.exports = setupSocketIO;
