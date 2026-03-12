
// Marcar el enlace activo en el header 
(function () {

  const links = document.querySelectorAll("#menu a");
  const current = window.location.pathname.split("/").pop();

  links.forEach(link => {

    const href = link.getAttribute("href").split("/").pop();

    if (href === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

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

 
//   (function () {
//     // Normaliza: quita barras finales y pasa a minúsculas para comparar
//     const norm = (path) => path.replace(/\/+$/, "").toLowerCase();

//     // Ruta actual (ej: "/html/hogar.html" o "/index.html")
//     const currentPath = norm(window.location.pathname);

//     // Selecciona todos los enlaces dentro del header con id="menu"
//     const links = document.querySelectorAll("#menu a");

//     links.forEach((link) => {
//       // Resuelve href relativo a la URL actual
//       const url = new URL(link.getAttribute("href"), window.location.origin);
//       const linkPath = norm(url.pathname);

//       // Reglas para considerar activo:
//       // 1) Coincidencia exacta de ruta
//       // 2) Tratar "index.html" como raíz de la carpeta (equivalente a "/carpeta/")
//       const isExact = currentPath === linkPath;

//       const isIndexEquivalent =
//         (currentPath.endsWith("/") && (linkPath.endsWith("/index.html") || linkPath === "/")) ||
//         (currentPath.endsWith("/index.html") &&
//           (linkPath === currentPath || linkPath === currentPath.replace(/index\.html$/, "")));

//       if (isExact || isIndexEquivalent) {
//         link.classList.add("active");
//         link.setAttribute("aria-current", "page");
//       } else {
//         link.classList.remove("active");
//         link.removeAttribute("aria-current");
//       }
//     });
//   })();
