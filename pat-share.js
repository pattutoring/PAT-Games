/* Reliable sharing for every PAT Learning Lab game. */
(function () {
  function flash(button, label) {
    const original = button.dataset.shareLabel || button.textContent.trim();
    button.dataset.shareLabel = original;
    button.textContent = label;
    window.setTimeout(function () { button.textContent = original; }, 1700);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {}

    let field;
    try {
      field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(field);
      field.focus();
      field.select();
      field.setSelectionRange(0, field.value.length);
      return document.execCommand("copy");
    } catch (error) {
      return false;
    } finally {
      if (field && field.parentNode) field.parentNode.removeChild(field);
    }
  }

  function pageShareText(button) {
    const heading = document.querySelector("h1") || document.querySelector("main h2");
    const puzzle = document.querySelector("#clueNumber, #puzzle-number, .puzzle-number, .puzzle-type");
    return [
      heading ? heading.textContent.trim() : document.title,
      puzzle ? puzzle.textContent.trim() : "PAT Learning Lab activity",
      "Play and learn with PAT Learning Lab."
    ].join("\n");
  }

  document.addEventListener("click", async function (event) {
    const button = event.target.closest("#shareButton, #generalShare, #miniShare, #shareBuzz, #native-share, #copy-share, [data-share]");
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const text = pageShareText(button);
    const url = window.location.href;
    const payload = { title: document.title, text: text, url: url };

    if (button.id !== "copy-share" && typeof navigator.share === "function") {
      try {
        await navigator.share(payload);
        flash(button, "Shared!");
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }

    const ok = await copyText([text, url].join("\n\n"));
    flash(button, ok ? "Copied!" : "Copy unavailable");
  }, true);
})();
