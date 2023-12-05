const socket = io(window.length.origin);
const roomId = window.location.pathname.split("/").pop();

socket.on("connect", () => {
  console.log("connected to server");

  socket.emit("join-room", roomId);
});

socket.on("room-not-found", () => {
  document.getElementById("room-found-content").style.display = "none";
  document.getElementById("room-not-found-content").style.display = "block";
});

let roomUsers = [];
let currentUser = "";
let words;
let currentWordIndex = 0;
let chars;
let totalChars;
let currentCharIndex = 0;
let completedWordCharIndex = 0;
let virtualText = "";

socket.on("user-connected", data => {
  currentUser = data.name;
  document.getElementById("room-info").textContent = `room ${data.room.id}`;
  document.getElementById("login-info").textContent = `logged in as ${currentUser}`;

  words = data.room.text.split(" ").map((word, index, array) => {
    return index === array.length - 1 ? word : word + " ";
  });

  chars = data.room.text.split("");

  while (words[words.length - 1] === " " || words[words.length - 1] === "") words.pop();
  while (chars[chars.length - 1] === " " || chars[chars.length - 1] === "") chars.pop();

  words[words.length - 1] = words[words.length - 1].trim();

  totalChars = chars.length;

  console.log("words: ", words);
  console.log("chars: ", chars);
  renderInitialText();

  console.log(data);
  roomUsers = data.users;
  renderUsers();

  document.getElementById("room-not-found-content").style.display = "none";
  document.getElementById("room-found-content").style.display = "block";
});

socket.on("broadcasted-user-connected", data => {
  roomUsers = [...roomUsers, data];
  renderUsers();
});

socket.on("broadcasted-user-disconnected", data => {
  roomUsers = roomUsers.filter(user => user.name !== data.name);
  renderUsers();
});

socket.on("broadcasted-word-completed", data => {
  moveCar(data.name, data.char);
});

const moveCar = (name, chars) => {
  const car = document.getElementById(`car-${name}`);
  const container = car.parentElement;

  const move = chars / totalChars;
  const maxPosition = container.offsetWidth - car.offsetWidth;
  const newLeft = move * maxPosition;

  // ensure the new position doesn't go beyond the container boundaries
  car.style.left = `${Math.min(maxPosition, Math.max(0, newLeft))}px`;
};

const renderUsers = () => {
  const race = document.getElementById("race");
  race.innerHTML = null;

  for (let i = 0; i < roomUsers.length; i++) {
    race.innerHTML = `${race.innerHTML}
    <div id="row-${roomUsers[i].name}" class="row">
      <div class="track">
        <div id="car-${roomUsers[i].name}" class="car">
          <span>${roomUsers[i].name === currentUser ? "&nbsp;you (guest)" : roomUsers[i].name}</span>
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
    if (char === " ") span.textContent = "•";
    else span.textContent = char;
    container.appendChild(span);
  });

  const caret = document.createElement("div");
  caret.classList.add("caret");
  caret.style.display = "none";
  container.appendChild(caret);

  updateCaretPosition();

  updatePlaceholder(0);
  highlightCurrentChar(0);
};

const updatePlaceholder = index => {
  const input = document.getElementById("input");
  input.placeholder = words[index];
  input.setAttribute("data-current-word", index);
};

const charsContainer = document.getElementById("text").children;
const highlightCurrentChar = index => {
  for (let i = 0; i < charsContainer.length; i++) {
    if (i === index) {
      charsContainer[i].classList.add("current-char");
    } else {
      charsContainer[i].classList.remove("current-char");
    }
  }
  updateCaretPosition();
};

const input = document.getElementById("input");
const highlightCompletedChars = () => {
  let earliestIncorrectChar = Infinity;
  for (let i = 0; i < charsContainer.length; i++) {
    const char = charsContainer[i];

    if (i >= earliestIncorrectChar) {
      for (let j = earliestIncorrectChar; j < currentCharIndex; j++) {
        const ichar = charsContainer[j];

        ichar.classList.remove("completed-char");
        ichar.classList.add("incorrect-char");
      }
      break;
    }

    if (char.textContent === virtualText[i] || (char.textContent === "•" && virtualText[i] === " ")) {
      char.classList.remove("incorrect-char");
      char.classList.add("completed-char");
    } else if (virtualText[i] === undefined) {
      char.classList.remove("completed-char");
      char.classList.remove("incorrect-char");
    } else {
      earliestIncorrectChar = i;
      char.classList.remove("completed-char");
      char.classList.add("incorrect-char");
    }
  }

  if (earliestIncorrectChar < Infinity) input.classList.add("incorrect-input");
  else input.classList.remove("incorrect-input");
};

const updateCaretPosition = () => {
  const currentCharElement = document.querySelector(".current-char");
  const caret = document.querySelector(".caret");

  if (currentCharElement && caret) {
    const rect = currentCharElement.getBoundingClientRect();
    const charTop = currentCharElement.offsetTop;

    const charWidth = currentCharElement.offsetWidth;
    caret.style.top = `${charTop}px`;
    caret.style.left = `${rect.right - charWidth}px`;
  }
};

let prevInput = "";
input.addEventListener("input", () => {
  const caret = document.querySelector(".caret");
  caret.style.display = "block";

  highlightCurrentChar(currentCharIndex);

  const diff = input.value.length - prevInput.length;
  currentCharIndex += diff;
  highlightCurrentChar(currentCharIndex);

  if (diff > 0) {
    virtualText += input.value.substring(prevInput.length);
  } else if (diff < 0) {
    virtualText = virtualText.slice(0, diff);
  }

  if (input.value === words[currentWordIndex]) {
    input.value = "";
    currentWordIndex += 1;
    // currentCharIndex += words[currentWordIndex - 1].length;
    completedWordCharIndex = currentCharIndex;

    updatePlaceholder(currentWordIndex);
    moveCar(currentUser, currentCharIndex);
    socket.emit("word-completed", { char: currentCharIndex });

    if (currentWordIndex === words.length) {
      // -2 don't include caret
      const lastChar = charsContainer[charsContainer.length - 2];
      lastChar.classList.add("completed-char");

      input.style.display = "none";
      document.getElementById("finish-text").style.display = "block";
      document.querySelector(".caret").style.display = "none";
    }
  }

  prevInput = input.value;
  updateCaretPosition();
  highlightCompletedChars();
});
