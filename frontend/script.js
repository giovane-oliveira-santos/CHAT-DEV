//const { send } = require("process");

const login = document.querySelector(".login");
const loginForm = document.querySelector(".login-form");
const loginInput = document.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.querySelector(".chat__input");
const chatMessage = document.querySelector(".chat__message");

const user = { id: "", nome: "", color: "" };

const colors = ["aqua", "black", "blue"];

let websocket;

const createMessageSeltElement = (content) => {
  const div = document.createElement("div");

  div.classList.add("message--self");
  div.innerHTML = content;

  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--other");
  span.classList.add("message--sender");
  span.style.color = senderColor;

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content;

  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const { useriId, userName, userColor, content } = JSON.parse(data);

  const message =
    useriId === user.id
      ? createMessageSeltElement(content)
      : createMessageOtherElement(content, userName, userColor);

  chatMessage.appendChild(message);

  scrollScreen();
};

const handlelogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("wss://chat-dev-frontend.onrender.com");
  websocket.onmessage = processMessage;

  //console.log(user);
};

const sendMessage = (event) => {
  event.preventDefault();

  const message = {
    useriId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));
  chatInput.value = "";
};

loginForm.addEventListener("submit", handleSubmit);
chatForm.addEventListener("submit", sendMessage);
