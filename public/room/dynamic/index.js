const socket = io(window.length.origin);

socket.on("connect", () => {
  console.log("connected to server");

  const roomId = window.location.pathname.split("/").pop();
  socket.emit("join-room", roomId);
});

let roomUsers = [];
let words;
let currentWordIndex = 0;
let chars;
let currentCharIndex = 0;

socket.on("user-connected", data => {
  document.getElementById("room-info").textContent = `room ${data.room.id}`;
  document.getElementById("login-info").textContent = `logged in as ${data.name}`;

  words = data.room.text.split(" ").map((word, index, array) => {
    return index === array.length - 1 ? word : word + " ";
  });

  chars = data.room.text.split("");
  console.log("words: ", words);
  console.log("chars: ", chars);
  renderInitialText(data.room.text);

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
        <div id="car-${roomUsers[i].name}" class="car">
          <span>${roomUsers[i].name}</span>
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

const renderInitialText = () => {
  const container = document.getElementById("text");

  chars.forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    container.appendChild(span);
  });

  updatePlaceholder(0);
  highlightCurrentChar(0);
};

const updatePlaceholder = index => {
  const input = document.getElementById("input");
  input.placeholder = words[index];
  input.setAttribute("data-current-word", index);
};

const wordsContainer = document.getElementById("text").children;
const highlightCurrentChar = index => {
  for (let i = 0; i < wordsContainer.length; i++) {
    if (i === index) {
      wordsContainer[i].classList.add("current-word");
    } else {
      wordsContainer[i].classList.remove("current-word");
    }
  }
};

const highlightIncorrectChar = index => {
  for (let i = 0; i < wordsContainer.length; i++) {
    if (i === index) {
      wordsContainer[i].classList.add("incorrect-word");
    } else {
      wordsContainer[i].classList.remove("incorrect-word");
    }
  }
};

let prevInput = "";
const input = document.getElementById("input");
input.addEventListener("input", () => {
  highlightCurrentChar(currentCharIndex);

  const diff = input.value.length - prevInput.length;
  currentCharIndex += diff;
  highlightCurrentChar(currentCharIndex);

  if (input.value === words[currentWordIndex]) {
    input.value = "";
    currentWordIndex += 1;
    // currentCharIndex += words[currentWordIndex - 1].length;

    updatePlaceholder(currentWordIndex);

    if (currentWordIndex === words.length) {
      console.log("done");
    }
  }

  prevInput = input.value;
});
