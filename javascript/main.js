
// Marcar el enlace activo en el header 
(function () {
  const menu = document.getElementById("menu");
  if (!menu) return;

  const norm = (p) => p.replace(/\/+$/, "").toLowerCase();
  const currentPath = norm(window.location.pathname.split("/").pop());

  menu.querySelectorAll("a").forEach((link) => {
    const linkPath = norm((link.getAttribute("href") || "").split("/").pop());

    const isExact = currentPath === linkPath;

    const isIndexEquivalent =
      (currentPath.endsWith("/") && (linkPath.endsWith("/index.html") || linkPath === "/")) ||
      (currentPath.endsWith("/index.html") &&
        (linkPath === currentPath || linkPath === currentPath.replace(/index.html$/, "")));

    const active = isExact || isIndexEquivalent;

    link.classList.toggle("active", active);

    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
})();

// --- 2) Import dinámico: cargar solo el JS de la página actual ---
(async function () {
  const path = window.location.pathname.toLowerCase();

  try {
    if (path.endsWith("/index.html") || path === "/") {
      // Si más adelante tienes lógica para la home:
      // await import("./index.js");
    } else if (path.endsWith("/html/hogar.html")) {
      await import("./hogar.js");      // /javascript/hogar.js
    } else if (path.endsWith("/html/prepago.html")) {
      await import("./prepago.js");    // /javascript/prepago.js
    } else if (path.endsWith("/html/postpago.html")) {
      await import("./postpago.js");   // /javascript/postpago.js
    }
  } catch (e) {
    console.error("Error cargando script específico de la página:", e);
  }
})();

// otra forma inportando los .js y encada.js la logica para cada html

// import"../prepago";
// import"../postpago";
// import"../hogar";

