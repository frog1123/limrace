const socket = io("http://localhost:3000");
// const socket = io("https://limrace-server.onrender.com/");

socket.on("connect", () => {
  console.log("connected to server");

  const roomId = window.location.pathname.split("/").pop();
  socket.emit("join-room", roomId);
});

let roomUsers = [];
socket.on("user-connected", data => {
  document.getElementById("login-info").textContent = `logged in as ${data.name} in room ${data.room}`;

  roomUsers = data.users;
  renderUsers();
});

socket.on("broadcasted-user-connected", data => {
  roomUsers = [...roomUsers, data];
  renderUsers();
});

socket.on("broadcasted-user-disconnected", data => {
  roomUsers = roomUsers.filter(user => user.name !== data.name);
  renderUsers();
});

const renderUsers = () => {
  console.log(roomUsers);
  const race = document.getElementById("race");
  race.innerHTML = null;

  for (let i = 0; i < roomUsers.length; i++) {
    race.innerHTML = `${race.innerHTML}
    <div id="row-${roomUsers[i].name}" class="row">
      <div class="track">
        <span>🏎️</span>
      </div>
      <div>
        <span>0 wpm</span>
        <span>${roomUsers[i].name}</span>
      </div>
    </div>
    ${i + 1 !== roomUsers.length ? `<div id="separator-${roomUsers[i].name}" class="separator"></div>` : ""}`;
  }
};
