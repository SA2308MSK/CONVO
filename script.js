// 🔥 Firebase Configuration (replace with your own Firebase info)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

const authSection = document.getElementById("authSection");
const chatSection = document.getElementById("chatSection");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");

let currentUser = localStorage.getItem("username");

// 🧍 If already logged in
if (currentUser) showChat();

document.getElementById("signupBtn").onclick = () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user && pass) {
    localStorage.setItem(user, pass);
    alert("Signup successful!");
  }
};

document.getElementById("loginBtn").onclick = () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const savedPass = localStorage.getItem(user);
  if (savedPass === pass) {
    localStorage.setItem("username", user);
    currentUser = user;
    showChat();
  } else {
    alert("Invalid credentials!");
  }
};

function showChat() {
  authSection.classList.add("hidden");
  chatSection.classList.remove("hidden");
  loadMessages();
}

// Send message
document.getElementById("sendBtn").onclick = () => {
  const msg = messageInput.value.trim();
  if (msg) {
    const timestamp = new Date().toLocaleTimeString();
    db.ref("messages").push({
      user: currentUser,
      text: msg,
      time: timestamp
    });
    messageInput.value = "";
  }
};

// Load messages in real-time
function loadMessages() {
  db.ref("messages").on("child_added", (snapshot) => {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.className = "message " + (data.user === currentUser ? "self" : "other");
    div.textContent = `${data.user}: ${data.text} (${data.time})`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Logout
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("username");
  window.location.reload();
};
