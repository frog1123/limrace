const socket = io(window.length.origin);

socket.on("connect", () => {
  console.log("[session] connected to server");
});

const current = JSON.parse(sessionStorage.getItem("current"));
console.log(current);
if (!current) {
  socket.emit("new-user");
}

socket.on("new-user-response", data => {
  sessionStorage.setItem("current", JSON.stringify({ name: data.name }));
});
