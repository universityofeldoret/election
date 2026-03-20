

function loadResults() {

  fetch(scriptURL)
    .then(res => res.json())
    .then(data => {

      let total = 0;
      let html = "";

      for (let c in data) {

        total += data[c];

        html += `
<div>
<h3>${c}</h3>
<p>${data[c]} votes</p>
</div>`;
      }

      document.getElementById("total").innerText = total;
      document.getElementById("results").innerHTML = html;

    });

}

setInterval(loadResults, 5000);
loadResults();