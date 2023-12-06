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

    socket.on("new-user", () => {
      // generate a random username for the user
      let newUserName;
      do {
        newUserName = `guest-${Math.floor(Math.random() * 900000) + 100000}`;
      } while (isUserNameTaken(newUserName));
      users.set(newUserName, { socketId: socket.id, room: null });

      socket.emit("new-user-response", {
        name: newUserName,
        room: null
      });
    });

    socket.on("create-room", () => {
      let roomId;
      do {
        roomId = Math.floor(100000 + Math.random() * 900000);
      } while (rooms.has(roomId));
      const text = generateRandomParagraph();

      rooms.set(roomId.toString(), { text });

      socket.emit("room-created", roomId);
    });

    socket.on("join-room", (name, roomId) => {
      if (!rooms.has(roomId)) {
        socket.emit("room-not-found");
        return;
      }

      // join the specified room
      socket.join(roomId);

      users.set(name, { socketId: socket.id, room: roomId });
      // emit a message to the user  with their details
      socket.emit("user-connected", {
        users: getUsersInRoom(roomId),
        room: {
          id: roomId,
          text: rooms.get(roomId).text
        }
      });

      socket.to(roomId).emit("broadcasted-user-connected", { name });

      console.log("[new user connected]", name);
    });

    socket.on("disconnect", () => {
      const user = getUserBySocketId(socket.id);

      if (user) {
        console.log("[user disconnected]", user.name);

        // broadcast to all users in the room that a user has disconnected
        socket.to(user.room).emit("broadcasted-user-disconnected", { name: user.name });

        users.delete(user.name);
      }
    });

    socket.on("word-completed", data => {
      const user = getUserBySocketId(socket.id);

      socket.to(user.room).emit("broadcasted-word-completed", { name: user.name, char: data.char });
    });
  });
};

const getUsersInRoom = roomId => {
  const usersInRoom = [];

  users.forEach((user, name) => {
    if (user.room === roomId) usersInRoom.push({ name });
  });

  return usersInRoom;
};

const isUserNameTaken = username => {
  return Array.from(users.values()).some(user => user.name === username);
};

const getUserBySocketId = socketId => {
  users.forEach((user, name) => {
    if (user.socketId === socketId) return { name, room: user.room };
  });
};

module.exports = setupSocketIO;
