const socket = io(window.length.origin);

socket.on("connect", () => {
  console.log("connected to server");

  const roomId = window.location.pathname.split("/").pop();
  socket.emit("join-room", roomId);
});

let roomUsers = [];
let currentWord;

socket.on("user-connected", data => {
  document.getElementById("login-info").textContent = `logged in as ${data.name} in room ${data.room.id}`;

  renderInitialText(data.room.text);
  currentWord - data.room.text.split(/\s+/)[0];

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
        <div id="car-${roomUsers[i].name}">
          <img src="/assets/red_car.svg" />
        </div>
      </div>
      <div>
        <span>0 wpm</span>
      </div>
    </div>
    <div id="separator-${roomUsers[i].name}" class="separator"></div>`;
  }
};

const renderInitialText = text => {
  const container = document.getElementById("text");
  const words = text.split(/\s+/);

  words.forEach(word => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    container.appendChild(span);
  });
};

const input = document.getElementById("input");
input.addEventListener("input", () => {
  console.log("Input value changed:", input.value);
});
