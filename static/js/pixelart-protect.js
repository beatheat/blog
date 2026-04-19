(function () {
  function blockContextMenu(event) {
    event.preventDefault();
  }

  function initPixelArtProtection() {
    var article = document.querySelector(".article-layout");
    if (!article) {
      return;
    }

    // Block context menu on artwork media in pixelart posts.
    var protectedTargets = article.querySelectorAll("img, picture, video, canvas");
    protectedTargets.forEach(function (target) {
      target.addEventListener("contextmenu", blockContextMenu);
      target.setAttribute("draggable", "false");
      target.addEventListener("dragstart", blockContextMenu);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPixelArtProtection);
  } else {
    initPixelArtProtection();
  }
})();
