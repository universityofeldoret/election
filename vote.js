
// 🔒 Device vote limit
const MAX_DEVICE_VOTES = 10;

/**
 * LOGIN
 */
function login() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  if (password !== "2026") {
    alert("Incorrect password");
    return;
  }

  if (!email.endsWith("@uoeld.ac.ke")) {
    alert("Use a valid school email");
    return;
  }

  switchSection("voteSection");
}

/**
 * GET DEVICE VOTE COUNT
 */
function getDeviceVotes() {
  return parseInt(localStorage.getItem("deviceVotes") || "0");
}

/**
 * INCREMENT DEVICE VOTES
 */
function incrementDeviceVotes() {
  let count = getDeviceVotes() + 1;
  localStorage.setItem("deviceVotes", count);
}

/**
 * VOTE FUNCTION
 */
function vote(candidate) {

  // 🚫 Device limit check (FAST)
  let deviceVotes = getDeviceVotes();

  if (deviceVotes >= MAX_DEVICE_VOTES) {
    alert("⚠️ This device has already voted " + MAX_DEVICE_VOTES + " times.");
    return;
  }

  const email = String(document.getElementById("email")?.value || "").trim();
  const admission = String(document.getElementById("admission")?.value || "").trim();
  const name = String(document.getElementById("name")?.value || "").trim();
  const course = String(document.getElementById("course")?.value || "").trim();

  if (!email || !admission || !name || !course) {
    alert("Please fill all details");
    return;
  }

  let button = event.target;
  if (button) {
    button.disabled = true;
    button.innerText = "Submitting...";
  }

  fetch(scriptURL, {
    method: "POST",
    body: new URLSearchParams({
      email, admission, name, course, candidate
    })
  })
    .then(res => res.text())
    .then(data => {

      if (button) {
        button.disabled = false;
        button.innerText = "Vote";
      }

      if (data === "SUCCESS") {

        // ✅ increment device votes
        incrementDeviceVotes();

        showSuccess(candidate);

      } else if (data === "DUPLICATE") {
        alert("⚠️ You have already voted");
      } else if (data === "INVALID_EMAIL") {
        alert("Invalid school email");
      } else {
        alert("Server error: " + data);
      }

    })
    .catch(() => {
      if (button) {
        button.disabled = false;
        button.innerText = "Vote";
      }
      alert("Network error");
    });
}

/**
 * SWITCH SECTIONS (CLEAN NAVIGATION)
 */
function switchSection(sectionId) {

  const sections = ["loginSection", "voteSection", "successSection", "adminSection"];

  sections.forEach(id => {
    let el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  let active = document.getElementById(sectionId);
  if (active) active.classList.add("active");
}

/**
 * SUCCESS SCREEN
 */
function showSuccess(candidate) {
  document.getElementById("votedCandidate").innerText = candidate;
  switchSection("successSection");
}

/**
 * BACK BUTTON
 */
function backToVote() {
  switchSection("voteSection");
}

/**
 * ADMIN PANEL
 */
function showAdmin() {
  switchSection("adminSection");
}

/**
 * BACK FROM ADMIN
 */
function backFromAdmin() {
  switchSection("voteSection");
}

/**
 * SHOW DEVICE LIMIT INFO (OPTIONAL DISPLAY)
 */
function showDeviceInfo() {
  let count = getDeviceVotes();
  alert("This device has voted " + count + " out of " + MAX_DEVICE_VOTES + " allowed times.");
}

/**
 * GLOBAL EXPORTS
 */
window.login = login;
window.vote = vote;
window.backToVote = backToVote;
window.showAdmin = showAdmin;
window.backFromAdmin = backFromAdmin;
window.showDeviceInfo = showDeviceInfo;