// document.addEventListener("DOMContentLoaded", function() {

//   const ruta = window.location.pathname.toLowerCase();
// //   let hoja = "";

//   const rutasMap = {
//     "postpago" : "Postpago",
//     "prepago" : "Prepago",
//     "hogar" : "Hogar"
//   }

//   const claveEncontrada = Object.keys(rutasMap).find(key => ruta.includes(key))

//   const hoja = claveEncontrada ? rutasMap[claveEncontrada] : "Postpago";

// //otra opcion
// //   if (ruta.includes("postpago")) hoja = "Postpago"; 
// //   else if (ruta.includes("prepago")) hoja = "Prepago";
// //   else if (ruta.includes("hogar")) hoja = "Hogar";
// //   else hoja = "Postpago";

//   const urlBase = "PEGA_AQUI_TU_URL_EXEC";
//   const url = `${urlBase}?hoja=${encodeURIComponent(hoja)}`;

//   const contenedor = document.getElementById("contenedor-planes");

//   fetch(url)
//     .then(res => res.json())
//     .then(data => {
//       contenedor.innerHTML = "";

//       data.forEach(plan => {
//         const card = document.createElement("div");
//         card.classList.add("plan-card");

//         card.innerHTML = `
//           <h2>${plan.titulo}</h2>
//           <p>${plan.descripcion}</p>
//           <p>${plan.dias} días</p> 
//           <strong>$${plan.precio}</strong>
//         `;

//         contenedor.appendChild(card);
//       });
//     })
//     .catch(error => {
//       console.error(error);
//       contenedor.innerHTML = "<p>Error al cargar datos</p>";
//     });

// });

