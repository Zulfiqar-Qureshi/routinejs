const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let bg = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];
let border = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

fetch(`./results.json`)
  .then((res) => res.json())
  .then((json) => {
    const ctx = document.getElementById("requests").getContext("2d");
    const meta = document.getElementById("meta");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Average", "Mean", "Min", "Max"],
        datasets: json.map((obj, index) => {
          meta.innerHTML = `
      <span style="color: white">
        <strong>Connections: </strong> ${obj.connections},
      </span>
      <span style="color: white">
        <strong>Pipelining: </strong> ${obj.pipelining},
      </span>
      <span style="color: white">
        <strong>Duration: </strong> ${obj.duration},
      </span>
      <span style="color: white">
        <strong>Samples: </strong> ${obj.samples}
      </span>
    `;
          let req = obj.requests;
          return {
            label: obj.title,
            data: [req.average, req.mean, req.min, req.max],
            backgroundColor: bg[index],
            borderColor: border[index],
            borderWidth: 1,
          };
        }),
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
