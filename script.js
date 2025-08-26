const loginForm = document.getElementById("loginForm");
const emailForm = document.getElementById("emailForm");
const loginBtn = document.getElementById("loginBtn");
const loginText = document.getElementById("loginText");
const loginSpinner = document.getElementById("loginSpinner");
const sendBtn = document.getElementById("sendBtn");
const sendText = document.getElementById("sendText");
const sendSpinner = document.getElementById("sendSpinner");
const statusMessage = document.getElementById("statusMessage");

// Simple session management
if (sessionStorage.getItem("adminAuthenticated") === "true") {
  loginForm.classList.add("hidden");
  emailForm.classList.remove("hidden");
}

// Login check
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Show loading state
  loginText.textContent = "Authenticating...";
  loginSpinner.classList.remove("hidden");
  loginBtn.disabled = true;

  // Simulate network delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (username === "admin" && password === "1234") {
    // Store authentication state
    sessionStorage.setItem("adminAuthenticated", "true");

    loginForm.classList.add("hidden");
    emailForm.classList.remove("hidden");
  } else {
    loginForm.classList.add("shake");
    setTimeout(() => loginForm.classList.remove("shake"), 500);
    showStatus("Invalid credentials!", "error");
  }

  // Reset button state
  loginText.textContent = "Login";
  loginSpinner.classList.add("hidden");
  loginBtn.disabled = false;
});

// Send email
emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const recipient = document.getElementById("recipient").value.trim();
  const template = document.getElementById("template").value;
  const buyerUsername = document.getElementById("buyerUsername").value.trim();
  const buyerPassword = document.getElementById("buyerPassword").value.trim();

  // Validation
  if (!recipient || !isValidEmail(recipient)) {
    showStatus("Please enter a valid email address", "error");
    return;
  }

  if (!buyerUsername || !buyerPassword) {
    showStatus("Please enter buyer credentials", "error");
    return;
  }

  // Show loading state
  sendText.textContent = "Sending...";
  sendSpinner.classList.remove("hidden");
  sendBtn.disabled = true;

  try {
    const res = await fetch(
      "https://email-sender-10k3.onrender.com/send-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          template,
          adminUsername: "admin",
          buyerUsername,
          buyerPassword,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      showStatus("Email sent successfully!", "success");
      // Clear form
      document.getElementById("recipient").value = "";
      document.getElementById("buyerUsername").value = "";
      document.getElementById("buyerPassword").value = "";
    } else {
      showStatus(data.error || "Failed to send email", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showStatus("Network error. Please try again.", "error");
  } finally {
    // Reset button state
    sendText.textContent = "Send Email";
    sendSpinner.classList.add("hidden");
    sendBtn.disabled = false;
  }
});

// Helper functions
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = "p-3 rounded-lg text-center text-sm font-medium";

  if (type === "success") {
    statusMessage.classList.add("bg-green-500/20", "text-green-300");
  } else {
    statusMessage.classList.add("bg-red-500/20", "text-red-300");
  }

  statusMessage.classList.remove("hidden");

  // Auto hide after 5 seconds
  setTimeout(() => {
    statusMessage.classList.add("hidden");
  }, 5000);
}
