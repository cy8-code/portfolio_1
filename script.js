const viewButtons = document.querySelectorAll("[data-view]");
const homeView = document.querySelector(".home-view");
const worksView = document.querySelector(".works-view");
const aboutView = document.querySelector(".about-view");
const siteFooter = document.querySelector(".site-footer");
const preview = document.querySelector(".hover-preview");
const previewImage = preview.querySelector("img");
const projectRows = document.querySelectorAll(".project-row");
const dialog = document.querySelector(".project-dialog");
const dialogImage = document.querySelector(".dialog-image");
const closeDialogButton = document.querySelector(".dialog-close");
const localTime = document.querySelector("#local-time");

const updateLocalTime = () => {
  const now = new Date();
  localTime.dateTime = now.toISOString();
  localTime.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
};

updateLocalTime();
window.setInterval(updateLocalTime, 1_000);

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const viewName = button.dataset.view;
    const views = { home: homeView, works: worksView, about: aboutView };

    Object.entries(views).forEach(([name, view]) => {
      const isVisible = name === viewName;
      view.hidden = !isVisible;
      view.classList.toggle("is-visible", isVisible);
    });
    document.body.classList.toggle("is-home", viewName === "home");
    siteFooter.hidden = viewName === "home";

    viewButtons.forEach((navButton) => {
      if (!navButton.classList.contains("nav-link")) return;
      const isCurrent = navButton.dataset.view === viewName;
      navButton.classList.toggle("is-active", isCurrent);
      if (isCurrent) navButton.setAttribute("aria-current", "page");
      else navButton.removeAttribute("aria-current");
    });

    preview.classList.remove("is-visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

projectRows.forEach((row) => {
  const showPreview = (event) => {
    if (window.matchMedia("(max-width: 600px)").matches) return;
    previewImage.src = row.dataset.image;
    previewImage.alt = row.dataset.alt;
    preview.classList.add("is-visible");
    if (event && event.clientY) {
      preview.style.top = `${Math.min(Math.max(event.clientY, 180), window.innerHeight - 180)}px`;
    }
  };

  row.addEventListener("pointerenter", showPreview);
  row.addEventListener("pointermove", showPreview);
  row.addEventListener("pointerleave", () => preview.classList.remove("is-visible"));
  row.addEventListener("focus", () => showPreview());
  row.addEventListener("blur", () => preview.classList.remove("is-visible"));

  row.addEventListener("click", () => {
    dialog.querySelector("#dialog-title").textContent = row.dataset.title;
    dialog.querySelector(".dialog-type").textContent = row.dataset.type;
    dialog.querySelector(".dialog-year").textContent = row.dataset.year;
    dialog.querySelector(".dialog-subtitle").textContent = row.dataset.subtitle;
    dialog.querySelector(".dialog-description").textContent = row.dataset.description;
    dialogImage.src = row.dataset.image;
    dialogImage.alt = row.dataset.alt;
    dialog.showModal();
  });
});

closeDialogButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});