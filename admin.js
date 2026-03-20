
const ADMIN_PASSWORD = "admin2026";

let adminBarChart, adminPieChart;

/**
 * ADMIN LOGIN
 */
function loginAdmin() {
  const pass = document.getElementById("adminPass")?.value.trim();

  if (!pass) {
    alert("Enter admin password");
    return;
  }

  if (pass !== ADMIN_PASSWORD) {
    alert("❌ Wrong password");
    return;
  }

  // Hide login, show dashboard
  document.getElementById("adminLogin").style.display = "none";
  document.getElementById("adminDashboard").style.display = "block";

  loadAdminResults();
}

/**
 * LOGOUT
 */
function logoutAdmin() {
  document.getElementById("adminDashboard").style.display = "none";
  document.getElementById("adminLogin").style.display = "block";

  // Clear password field
  document.getElementById("adminPass").value = "";
}

/**
 * LOAD RESULTS
 */
function loadAdminResults() {

  fetch(scriptURL)
    .then(res => res.json())
    .then(data => {

      let labels = [];
      let values = [];
      let total = 0;

      for (let c in data) {
        labels.push(c);
        values.push(data[c]);
        total += data[c];
      }

      document.getElementById("adminTotalVotes").innerText = total;

      // Vote list
      let html = "<h3>Vote Breakdown:</h3><ul>";
      for (let c in data) {
        html += `<li>${c}: ${data[c]} votes</li>`;
      }
      html += "</ul>";

      document.getElementById("voteList").innerHTML = html;

      // Charts
      const barCtx = document.getElementById("adminBarChart").getContext("2d");
      const pieCtx = document.getElementById("adminPieChart").getContext("2d");

      if (adminBarChart) adminBarChart.destroy();
      if (adminPieChart) adminPieChart.destroy();

      adminBarChart = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Votes",
            data: values,
            backgroundColor: "#00a651"
          }]
        }
      });

      adminPieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ["#00a651", "#007a45", "#ffa500", "#ff0000", "#0000ff"]
          }]
        }
      });

    })
    .catch(err => {
      console.error("Admin error:", err);
      alert("Failed to load results");
    });
}

/**
 * AUTO REFRESH (ONLY WHEN DASHBOARD IS OPEN)
 */
setInterval(() => {
  const dashboard = document.getElementById("adminDashboard");
  if (dashboard && dashboard.style.display === "block") {
    loadAdminResults();
  }
}, 5000);

/**
 * GLOBAL EXPORTS
 */
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;