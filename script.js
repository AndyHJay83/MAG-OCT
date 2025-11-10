document.addEventListener("DOMContentLoaded", () => {
  const flipbookElement = document.getElementById("flipbook");

  if (!flipbookElement) {
    console.error("Flipbook container not found.");
    return;
  }

  const placeholderPages = [
    "https://placehold.co/800x1100?text=Page+1",
    "https://placehold.co/800x1100?text=Page+2",
    "https://placehold.co/800x1100?text=Page+3",
    "https://placehold.co/800x1100?text=Page+4",
    "https://placehold.co/800x1100?text=Page+5",
    "https://placehold.co/800x1100?text=Page+6"
  ];

  const fragment = document.createDocumentFragment();

  placeholderPages.forEach((src) => {
    const page = document.createElement("div");
    page.className = "page";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Magazine page";
    img.loading = "lazy";

    page.appendChild(img);
    fragment.appendChild(page);
  });

  flipbookElement.appendChild(fragment);

  const flip = new St.PageFlip(flipbookElement, {
    width: 800,
    height: 1100,
    size: "stretch",
    showCover: true,
    mobileScrollSupport: true
  });

  flip.loadFromHTML(flipbookElement.querySelectorAll(".page"));
});

