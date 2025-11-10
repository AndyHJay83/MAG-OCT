document.addEventListener("DOMContentLoaded", () => {
  const flipbookElement = document.getElementById("flipbook");

  if (!flipbookElement) {
    console.error("Flipbook container not found.");
    return;
  }

  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-message";
  loadingOverlay.innerHTML = `
    <strong>Loading magazine…</strong>
    <span>Please wait while we render the pages.</span>
  `;
  flipbookElement.appendChild(loadingOverlay);

  const handleError = (error) => {
    console.error("Failed to initialize flipbook:", error);
    loadingOverlay.innerHTML = `
      <strong>Something went wrong.</strong>
      <span>Refresh the page or try again later.</span>
    `;
  };

  const initializeFlipbook = (pageElements) => {
    const fragment = document.createDocumentFragment();
    pageElements.forEach((pageEl) => fragment.appendChild(pageEl));
    flipbookElement.appendChild(fragment);

    try {
      const flip = new St.PageFlip(flipbookElement, {
        width: 800,
        height: 1100,
        size: "stretch",
        showCover: true,
        mobileScrollSupport: true
      });

      flip.loadFromHTML(flipbookElement.querySelectorAll(".page"));
      loadingOverlay.remove();
    } catch (err) {
      handleError(err);
    }
  };

  const renderPdf = async () => {
    if (typeof pdfjsLib === "undefined") {
      throw new Error("PDF.js library failed to load.");
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";

    const pdfUrl = "./assets/magazine.pdf";
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const pageElements = [];
    const targetWidth = 800;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const scale = targetWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });

      canvas.width = Math.floor(scaledViewport.width);
      canvas.height = Math.floor(scaledViewport.height);

      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
        intent: "display"
      }).promise;

      const pageWrapper = document.createElement("div");
      pageWrapper.className = "page";

      const image = document.createElement("img");
      image.src = canvas.toDataURL("image/jpeg", 0.92);
      image.alt = `Magazine page ${pageNumber}`;
      image.loading = "lazy";

      pageWrapper.appendChild(image);
      pageElements.push(pageWrapper);
    }

    return pageElements;
  };

  renderPdf().then(initializeFlipbook).catch(handleError);
});

