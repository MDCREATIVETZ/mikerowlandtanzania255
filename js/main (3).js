document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#main-menu");
  const dropdowns = document.querySelectorAll(".dropdown");

  const closeDropdowns = (except = null) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== except) {
        dropdown.classList.remove("open");
        dropdown.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
      }
    });
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    if (!isOpen) closeDropdowns();
  });

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains("open");
      closeDropdowns(dropdown);
      dropdown.classList.toggle("open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown")) closeDropdowns();
    if (!event.target.closest(".navbar") && menu.classList.contains("open")) {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdowns();
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.focus();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 15);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelector("#current-year").textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll(".info-card, .team-card, .glass-panel, .credential-card, .timeline article");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }


  const galleryFilters = document.querySelectorAll(".gallery-filter");
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      galleryFilters.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      galleryItems.forEach((item) => {
        item.hidden = filter !== "All" && item.dataset.category !== filter;
      });
    });
  });

  const lightbox = document.querySelector("#gallery-lightbox");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector("p");
    const lightboxClose = lightbox.querySelector(".lightbox-close");
    let lastFocusedItem = null;

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      lightboxImage.src = "";
      if (lastFocusedItem) lastFocusedItem.focus();
    };

    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        lastFocusedItem = item;
        const thumbnail = item.querySelector("img");
        lightboxImage.src = item.dataset.full;
        lightboxImage.alt = thumbnail.alt;
        lightboxCaption.textContent = thumbnail.alt;
        lightbox.hidden = false;
        document.body.classList.add("lightbox-open");
        lightboxClose.focus();
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }
});
