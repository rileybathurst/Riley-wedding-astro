import Masonry from "masonry-layout";

const galleries = document.querySelectorAll<HTMLElement>(".gallery");
const supportsGridLanes = CSS.supports("display", "grid-lanes");

const updateSelectedSpan = (gallery: HTMLElement) => {
  if (!supportsGridLanes) {
    return;
  }

  const gridTemplateColumns = getComputedStyle(gallery).gridTemplateColumns;

  if (!gridTemplateColumns || gridTemplateColumns === "none") {
    return;
  }

  const columnCount = gridTemplateColumns.split(" ").filter(Boolean).length;

  gallery.style.setProperty("--gallery-column-count", String(columnCount));
};

const masonryGalleries = new Map<HTMLElement, Masonry>();

galleries.forEach((gallery) => {
  if (!supportsGridLanes) {
    const galleryStyles = getComputedStyle(gallery);
    const gap = parseFloat(galleryStyles.rowGap || galleryStyles.gap) || 16;

    gallery.classList.add("gallery--masonry");
    masonryGalleries.set(
      gallery,
      new Masonry(gallery, {
        itemSelector: ".gallery-item",
        gutter: gap,
        percentPosition: true,
      }),
    );
  }

  updateSelectedSpan(gallery);

  gallery.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const image = target.closest(".gallery-item");

    if (!(image instanceof HTMLElement) || !gallery.contains(image)) {
      return;
    }

    image.classList.toggle("selected");
    updateSelectedSpan(gallery);
    masonryGalleries.get(gallery)?.layout();
  });
});

window.addEventListener("resize", () => {
  galleries.forEach(updateSelectedSpan);
});
