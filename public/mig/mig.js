class Mig {
  constructor(migTime = 3000) {
    this.migTime = migTime;
  }
  static clockGenerator() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    hours < 10 ? (hours = "0" + hours) : hours;
    minutes < 10 ? (minutes = "0" + minutes) : minutes;
    return `${hours}:${minutes}`;
  }
  success(title, message, options) {
    this.templateBuilder(
      title,
      message,
      ["mig", "success"],
      "success.png",
      options
    );
  }
  error(title, message, options) {
    this.templateBuilder(
      title,
      message,
      ["mig", "error"],
      "error.png",
      options
    );
  }
  warning(title, message, options) {
    this.templateBuilder(
      title,
      message,
      ["mig", "warning"],
      "warning.png",
      options
    );
  }
  info(title, message, options) {
    this.templateBuilder(title, message, ["mig", "info"], "info.png", options);
  }
  dark(title, message, options) {
    this.templateBuilder(title, message, ["mig", "dark"], "dark.png", options);
  }
  done(title, message, options) {
    this.templateBuilder(title, message, ["mig", "done"], "done.png", options);
  }
  templateBuilder(title, message, classes, avatar, options = {}) {
    const {
      closeButton: close = true,
      clock = true,
      customColor = {},
    } = options;
    const {
      titleColor,
      messageColor,
      clockColor,
      boxBg,
      closeColor,
    } = customColor;
    const mig = document.querySelector(".mig-container");
    let template = document.createElement("div");
    document.querySelector(".message-sound").play();
    template.classList.add(...classes);
    template.id = Math.floor(Math.random() * 482429412420);
    boxBg ? (template.style.background = boxBg) : null;
    template.innerHTML = `
    <div class="mig-body">
    ${
      close
        ? `<span class="fa fa-times close" style="color: ${
            closeColor ? closeColor : ""
          }"></span>`
        : ``
    }
    <div><div class="mig-avatar"><img src="/mig/images/${avatar}" alt=""/></div></div>
    <div class="mig-messages">
    <div class="mig-title" style="color: ${
      titleColor ? titleColor : ""
    }">${title}</div>
    <div class="mig-message" style="color: ${
      messageColor ? messageColor : ""
    }">${message}</div>
    </div>
    ${
      clock
        ? `<div class="mig-clock" style="color:${
            clockColor ? clockColor : ""
          }">${Mig.clockGenerator()}</div>`
        : ""
    }
    </div>`;
    mig.insertBefore(template, mig.childNodes[0]);
    setTimeout(() => template.classList.add("active"), 100);
    this.deleteMig(template.id);
    const closeBtn = document.querySelectorAll(".close");
    closeBtn.forEach((element) =>
      element.addEventListener("click", (e) => {
        const mig = e.target.parentElement.parentElement;
        mig.classList.remove("active");
        setTimeout(() => mig.remove(), 500);
      })
    );
  }
  deleteMig(id) {
    const mig = document.getElementById(id);
    setTimeout(() => {
      mig.classList.remove("active");
      setTimeout(() => mig.remove(), 120);
    }, this.migTime);
  }
}
