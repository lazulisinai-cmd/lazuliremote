(function () {
  "use strict";

  // Mobiele navigatie
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Menu openen" : "Menu sluiten");
      nav.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Menu openen");
        toggle.focus();
      }
    });
  }

  // Jaartal in footer
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Contactformulier
  var form = document.getElementById("contact-form");
  if (!form) return;

  // Dienst vooraf selecteren via ?dienst=<slug> (links vanaf dienstpagina's)
  try {
    var dienst = new URLSearchParams(window.location.search).get("dienst");
    var select = form.querySelector("#dienst");
    if (dienst && select) {
      var opt = select.querySelector('option[data-slug="' + dienst.replace(/[^a-z-]/g, "") + '"]');
      if (opt) select.value = opt.value;
    }
  } catch (e) { /* oude browsers: geen voorselectie */ }

  function setError(field, msg) {
    var el = form.querySelector("#" + field.id + "-error");
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (el) { el.textContent = msg || ""; el.classList.toggle("is-visible", !!msg); }
  }

  function validate(field) {
    var v = field.validity;
    if (v.valid) { setError(field, ""); return true; }
    if (v.valueMissing) setError(field, field.dataset.required || "Dit veld is verplicht.");
    else if (v.typeMismatch) setError(field, "Vul een geldig e-mailadres in.");
    else setError(field, "Controleer dit veld.");
    return false;
  }

  form.setAttribute("novalidate", "");
  Array.prototype.forEach.call(form.querySelectorAll("[required]"), function (f) {
    f.addEventListener("blur", function () { validate(f); });
    f.addEventListener("change", function () { if (f.getAttribute("aria-invalid") === "true") validate(f); });
  });

  form.addEventListener("submit", function (e) {
    var firstInvalid = null;
    Array.prototype.forEach.call(form.querySelectorAll("[required]"), function (f) {
      if (!validate(f) && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) { e.preventDefault(); firstInvalid.focus(); }
  });
})();
