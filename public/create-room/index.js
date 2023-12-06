const createRoom = document.getElementById("create-room-btn");

socket.on("connect", () => {
  console.log("connected to server");
});

createRoom.onclick = () => {
  socket.emit("create-room");
};

socket.on("room-created", roomId => {
  console.log(roomId);

  window.location.href = `/room/${roomId}`;
});
