// =========================================================
// NodoChain — script.js
// Efecto de scroll en la barra de navegación + menú móvil +
// validación del formulario de contacto y "archivo de datos"
// (guardado en localStorage, ya que el sitio se aloja en un
// hosting estático gratuito sin backend propio).
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  /* ---- Efecto de transparencia -> sólido al hacer scroll ---- */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 40) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
  }

  /* ---- Menú móvil ---- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* ---- Formulario de contacto: validación + "archivo de datos" ---- */
  const form = document.getElementById("contact-form");
  if (form) {
    const status = document.getElementById("form-status");

    const rules = {
      nombre: (v) => v.trim().length >= 3,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      telefono: (v) => /^[0-9+\-\s]{7,15}$/.test(v.trim()),
      mensaje: (v) => v.trim().length >= 10,
    };

    function validateField(field) {
      const row = field.closest(".form-row");
      const rule = rules[field.name];
      if (!rule) return true;
      const ok = rule(field.value);
      row.classList.toggle("invalid", !ok);
      return ok;
    }

    form.querySelectorAll("input[name], textarea[name]").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let allValid = true;
      form.querySelectorAll("input[name], textarea[name]").forEach((field) => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        status.textContent = "Revisa los campos marcados en rojo antes de enviar.";
        status.className = "form-status fail";
        return;
      }

      const registro = {
        nombre: form.nombre.value.trim(),
        email: form.email.value.trim(),
        telefono: form.telefono.value.trim(),
        asunto: form.asunto ? form.asunto.value : "",
        mensaje: form.mensaje.value.trim(),
        fecha: new Date().toISOString(),
      };

      // "Archivo de datos" del sitio: se guarda en localStorage del
      // navegador como una lista JSON (nodochain_contactos), ya que
      // el sitio se aloja en un hosting estático gratuito sin backend.
      const key = "nodochain_contactos";
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      data.push(registro);
      localStorage.setItem(key, JSON.stringify(data));

      status.textContent = "¡Gracias, " + registro.nombre + "! Tu mensaje quedó guardado correctamente.";
      status.className = "form-status ok";
      form.reset();
      renderRecords();
    });

    function renderRecords() {
      const tbody = document.getElementById("records-body");
      if (!tbody) return;
      const data = JSON.parse(localStorage.getItem("nodochain_contactos") || "[]");
      tbody.innerHTML = "";
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Todavía no hay mensajes guardados en este navegador.</td></tr>';
        return;
      }
      data
        .slice()
        .reverse()
        .forEach((r) => {
          const tr = document.createElement("tr");
          tr.innerHTML =
            "<td>" + r.nombre + "</td><td>" + r.email + "</td><td>" + r.telefono + "</td><td>" +
            new Date(r.fecha).toLocaleString() + "</td>";
          tbody.appendChild(tr);
        });
    }
    renderRecords();
  }
});
