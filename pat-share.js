/* Shared PAT Learning Lab share helper. */
(function () {
  function flash(button, message) {
    if (!button) return;
    const old = button.dataset.shareLabel || button.textContent.trim();
    button.dataset.shareLabel = old;
    button.textContent = message;
    window.setTimeout(function () { button.textContent = old; }, 1500);
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

  async function share(button, payload) {
    const url = payload.url || window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: payload.title, text: payload.text, url: url });
        flash(button, "Shared!");
        return "native";
      } catch (error) {
        if (error && error.name === "AbortError") return "cancelled";
      }
    }

    const ok = await copyText([payload.text || "", url].filter(Boolean).join("\n\n"));
    if (ok) {
      flash(button, "Copied!");
      return "clipboard";
    }
    flash(button, "Copy unavailable");
    return "unavailable";
  }

  window.PATShare = { copyText: copyText, share: share };
})();
