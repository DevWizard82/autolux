import Plotly from "plotly.js-dist";

const CANVAS = document.getElementById("tester");

Plotly.newPlot(
  CANVAS,
  [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16],
      type: "scatter",
      mode: "lines+markers",
      line: { color: "cyan", width: 2 },
      marker: { color: "cyan", size: 8 },
    },
  ],
  {
    title: { text: "Evolution de valeurs", font: { size: 18, color: "#fff" } },
    xaxis: {
      title: { text: "X axis", font: { color: "#fff" } },
      tickfont: { color: "#fff" },
      gridcolor: "#333",
    },
    yaxis: {
      title: { text: "Y axis", font: { color: "#fff" } },
      tickfont: { color: "#fff" },
      gridcolor: "#333",
    },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    margin: { t: 60, l: 60, r: 30, b: 50 },
    responsive: true,
  }
);
