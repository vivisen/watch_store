//! Variables
const themeTogglerBtn = document.querySelector(".theme-toggler");

//! Functions
const getPrefersColorScheme = () => {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return dark ? "dark" : "light";
};
const themeToggler = ({ target }) => {
  const nowTheme = localStorage.getItem("theme");
  if (nowTheme === "dark") {
    localStorage.setItem("theme", "light");
    document.querySelector("html").classList.replace("dark", "light");
    target.classList.replace("fa-moon-o", "fa-sun-o");
  } else {
    localStorage.setItem("theme", "dark");
    document.querySelector("html").classList.replace("light", "dark");
    target.classList.replace("fa-sun-o", "fa-moon-o");
  }
};

//! EventListeners
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme")) {
    const themeMode = localStorage.theme;
    document.querySelector("html").classList.add(themeMode);
    themeMode === "dark"
      ? themeTogglerBtn.classList.add("fa-moon-o")
      : themeTogglerBtn.classList.add("fa-sun-o");
  } else {
    const themeMode = getPrefersColorScheme();
    document.querySelector("html").classList.add(themeMode);
    localStorage.setItem("theme", themeMode);
    themeTogglerBtn.classList.add("fa-sun-o");
    themeMode === "dark"
      ? themeTogglerBtn.classList.add("fa-moon-o")
      : themeTogglerBtn.classList.add("fa-sun-o");
  }
});
themeTogglerBtn.addEventListener("click", themeToggler);
//* Delete loader after complete load page eventListener
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  return loader.remove();
});

const options = {
  series: [
    {
      name: "This Client: ",
      data: [102, 80, 95, 150, 200, 185],
    },
  ],
  totalComments() {
    const series = this.series;
    const total = series[0].data.reduce((x, y) => x + y);
    return total;
  },
  tooltip: {
    theme: "dark",
  },
  chart: {
    height: 450,
    type: "bar",
    fontFamily: "rajdhani",
    events: {
      click: function (chart, w, e) {},
    },
  },
  colors: ["#E11D48", "#C026D3", "#DB2777", "#4F46E5", "#65A30D", "#EA580C"],
  plotOptions: {
    bar: {
      columnWidth: "90%",
      distributed: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  legend: {
    show: true,
    fontFamily: "rajdhaniSemibold",
    labels: {
      colors: "#fff",
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  xaxis: {
    categories: ["bug", "Baz", "Bar", "Foo", "mig", "alireza"],
    labels: {
      style: {
        colors: "#fff",
        fontSize: "14px",
        color: "#fff",
      },
    },
  },
  title: {
    text: "Top Clients in month",
    align: "center",
    style: {
      color: "#fff",
      fontFamily: "RajdhaniBold",
      fontSize: "18px",
    },
  },
  yaxis: {
    show: true,
    showAlways: true,
    showForNullSeries: true,
    labels: {
      show: true,
      align: "left",
      width: 0,
      offsetX: 20,
      style: {
        fontSize: "12px",
        fontFamily: "rajdhaniSemibold",
        cssClass: "apexcharts-yaxis-label",
        colors: "#fff",
      },
    },
    axisBorder: {
      show: true,
      color: "#fff",
      offsetX: -25,
      offsetY: 0,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: true,
      position: "back",
      stroke: {
        color: "#fff",
        width: 5,
      },
    },
    tooltip: {
      enabled: true,
      offsetX: 0,
    },
  },
};
const line = {
  series: [
    {
      name: "This Month",
      data: [10, 54, 30, 40, 50],
    },
    {
      name: "Last Month",
      data: [50, 85, 70, 80, 90],
    },
  ],
  totalStatus() {
    const series = this.series;
    let total = 0;
    series.forEach((serie) => {
      total += serie.data.reduce((x, y) => x + y);
    });
    return total;
  },
  chart: {
    height: 450,
    type: "area",
    fontFamily: "rajdhani",
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    labels: { show: false },
  },
  title: {
    text: "Clients register in website survey",
    align: "center",
    style: {
      color: "#fff",
      fontWeight: "normal",
      fontSize: "18px",
      fontFamily: "RajdhaniBold",
    },
  },
  tooltip: {
    theme: "dark",
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
  yaxis: {
    show: true,
    showAlways: true,
    showForNullSeries: true,
    labels: {
      show: true,
      align: "left",
      width: 0,
      offsetX: 20,
      style: {
        fontSize: "12px",
        fontFamily: "rajdhaniSemibold",
        cssClass: "apexcharts-yaxis-label",
        colors: "#fff",
      },
    },
    axisBorder: {
      show: true,
      color: "#fff",
      offsetX: -25,
      offsetY: 0,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: true,
      position: "back",
      stroke: {
        color: "#fff",
        width: 5,
      },
    },
    tooltip: {
      enabled: true,
      offsetX: 0,
    },
  },
  legend: {
    fontFamily: "rajdhaniSemibold",
    labels: {
      colors: "#fff",
    },
    markers: {
      offsetX: 5,
    },
    itemMargin: {
      horizontal: 20,
      vertical: 10,
    },
  },
};

const chart = new ApexCharts(document.querySelector("#chart"), options);
const lineChart = new ApexCharts(document.querySelector("#line"), line);
chart.render();
lineChart.render();
