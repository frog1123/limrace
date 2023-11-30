// const socket = io("http://localhost:3000");
const socket = io("http://limrace-app.vercel.app");

socket.on("connect", () => {
  console.log("connected to server");
  socket.emit("new-user-connected");
});

socket.on("user-connected", data => {
  document.getElementById("login-info").textContent = `logged in as ${data.name}`;

  console.log(data);

  race.innerHTML = `${race.innerHTML}
  <div id="row-${data.name}" class="row">
    <div class="track">
      <span>🏎️</span>
    </div>
    <div>
      <span>0 wpm</span>
      <span>${data.name}</span>
    </div>
  </div>
  <div id="separator-${data.name}" class="separator"></div>`;

  for (let i = 0; i < data.otherUsers.length; i++) {
    race.innerHTML = `${race.innerHTML}
    <div id="row-${data.otherUsers[i]}" class="row">
      <div class="track">
        <span>🏎️</span>
      </div>
      <div>
        <span>0 wpm</span>
        <span>${data.otherUsers[i]}</span>
      </div>
    </div>
    <div id="separator-${data.otherUsers[i]}" class="separator"></div>`;
  }
});

socket.on("broadcasted-user-connected", name => {
  const race = document.getElementById("race");

  race.innerHTML = `${race.innerHTML}
  <div id="row-${name}" class="row">
    <div class="track">
      <span>🏎️</span>
    </div>
    <div>
      <span>0 wpm</span>
      <span>${name}</span>
    </div>
  </div>
  <div id="separator-${name}" class="separator"></div>`;
});

socket.on("broadcasted-user-disconnected", name => {
  const rowElement = document.getElementById(`row-${name}`);
  const separatorElement = document.getElementById(`separator-${name}`);

  rowElement.remove();
  separatorElement.remove();
});
