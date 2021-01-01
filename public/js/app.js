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
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  return loader.remove();
});
themeTogglerBtn.addEventListener("click", themeToggler);
