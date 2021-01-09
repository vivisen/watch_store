//! Variables
const themeTogglerBtn = document.querySelector(".theme-toggler");

//! Functions
const getPrefersColorScheme = () => {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return dark ? "dark" : "light";
};

//! EventListeners
//? set page color schema after DOMContentLoaded listener runed!
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme")) {
    const themeMode = localStorage.theme;
    document.querySelector("html").classList.add(themeMode);
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
//* Delete loader after complete load page eventListener
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  return loader.remove();
});
