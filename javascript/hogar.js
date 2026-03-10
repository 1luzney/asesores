import { getDatos } from './excel.js';

async function cargarContenido() {
    console.log("Cargando información...");
    const datos = await getDatos('HOGAR - CANAL CALLE');
    console.log("Datos recibidos:", datos);

    const contenedor = document.getElementById('contenedor-planes');
    if (!contenedor) return;

    if (datos.length === 0) {
        contenedor.innerHTML = "<h3>No hay datos para mostrar. Revisa la consola (F12).</h3>";
        return;
    }

    const datosFiltrados = datos.filter(item => item.Operador && item.Operador !== 'Sin Operador');
    datosFiltrados.sort((a, b) => a.Operador.localeCompare(b.Operador)); // Ordenar por operador

    let ultimoOperador = "" ;

    const coloresOperadores = {
        "Claro": "#e63946",
        "Movistar": "#2dc653",
        "Tigo": "#1d70b8",
        "WOM": "#7b2fff",
        "Virgin Mobile": "#ff6b00"
    };

    const titulosProOperador = {
        "Claro": "Planes Movil C",
        "Movistar": "Planes Movil M",
        "Tigo": "Planes Movil T",
        "WOM": "Planes Movil W",
        "Virgin Mobile": "Planes Movil V"
    }

    // Agrupar por operador
    const porOperador = {};

    let htmlFinal = "";
    datosFiltrados.forEach(item => {
        
        if (!porOperador[item.Operador]) {
            porOperador[item.Operador] = [];
        }
        porOperador[item.Operador].push(item);

        
    });

   

    // Renderizar una columna por operador
    contenedor.innerHTML = Object.entries(porOperador).map(([operador, items]) => {
        const color = coloresOperadores[operador] || '#333';

        const titutloDinamico = titulosProOperador[operador] || `Planes ${operador}`;

        const cards = items.map(item => {
            return`
            <div class="card-wrapper">
                <div class="tittle-paquetes" style="border-top: 4px solid ${color};">
                    <h2 style="color: ${color};">
                        <strong></strong> ${item['Paquete'] || 'N/A'}
                    </h2>
                </div>
                <div class="content">
                    <h3>Precio Mes</h3>
                      <p><strong style="color:red; font-size: 1.5em; font-weight: bold;">$ ${item[' Precio '] || 'Consultar'}</strong></p>
                     <p> ${item['Velocidad del @'] || 'N/A'}</p>
                    
                     <p><strong>TV: </strong> ${item['Tipo de TV'] || 'General'}</p>
                     <p><strong>Decos: </strong> ${item['Cantidad de Decos incluidos'] || 'N/A'}</p>
                    <p><strong>Valores Agregados: </strong> ${item['Valores Agregados'] || 'N/A'}</p
                    <p><strong>Observación: </strong>${item['Observación'] || 'N/A'}</p
                </div>
            </div>
        `}).join('');







        return `
        <div class="operador-section">
            <h1 style="color: ${color}">${titutloDinamico}</h1>
            <div class="cards-container">
                ${cards}
            </div>
        </div>
        `;
    }).join('');
}

cargarContenido();




const links = document.querySelectorAll('#menu a');
const paginaActual = window.location.pathname.split("/").pop(); // Obtiene el nombre del archivo

links.forEach(link => {
  if (link.getAttribute('href') === paginaActual) {
    link.classList.add('active'); // Clase para estilos
  }
});










// import { cargarExcel} from "./excel.js";

//  const ruta = window.location.pathname.toLowerCase();
//   const urlBase = "../assets/Benchmarking.xlsx"; // Excel completo en /public
//   const rutasMap = {
//     "postpago": "PREPAGO - CANAL TAT",
//     "prepago": "MOVIL - CANAL PDV",
//     "hogar": "HOGAR - CANAL CALLE"
//   };

//   // 2. IDENTIFICAR QUÉ PÁGINA MOSTRAR
//   const claveEncontrada = Object.keys(rutasMap).find(key => ruta.includes(key));
//   const hoja = claveEncontrada ? rutasMap[claveEncontrada] : "PREPAGO-CANAL TAT";

//   const contenedor = document.getElementById("contenedor-planes");

// async function iniciarHogar() {
//     const datos = await cargarExcel();
//     const tbody = document.getElementById("tablaHogar").querySelector("tbody");
//     tbody.innerHTML = ""; // Limpiar tabla

//     const cargarDatos = async (tituloPersonalizado) => {
//     try {
//         const res = await fetch(urlBase);
//         if (!res.ok) throw new Error("No se pudo descargar el Excel");

//         const buffer = await res.arrayBuffer();
//         const libro = XLSX.read(buffer, { type: 'array' });
//         const contenidoHoja = libro.Sheets[hoja];
        
//         // 1. Procesamos y filtramos en un solo paso usando range: 1
//         const rawData = XLSX.utils.sheet_to_json(contenidoHoja, { range: 1 });
//         const data = rawData.filter(fila => fila["Operador"]).map(fila => ({
//             operador: fila["Operador"] || "",
//             titulo: fila["Paquete"] || "",
//             descripcion: fila["Categoria"] || "",
//             red: fila["Red"] || "",
//             precio: fila[" Precio "] || fila["Precio de la Recarga"] || fila["CFM Con Impuesto\r\nTotal Tarifa"] || "" 
//         }));
// console.log("columnas disponibles: ", Object.keys(rawData[0]));
//         const contenedor = document.getElementById("contenedor-planes");
//         contenedor.innerHTML = "";
//         let operadorActual = "";

//         // 2. Generar tarjetas
//         data.forEach(plan => {
//             if (plan.operador !== operadorActual) {
//                 operadorActual = plan.operador;
//                 const nuevoTitulo = document.createElement("h2");
//                 nuevoTitulo.innerText = `${tituloPersonalizado} ${operadorActual}`;
//                 contenedor.appendChild(nuevoTitulo);
//             }

//             const card = document.createElement("div");
//             card.classList.add("paquetes");
            
//              const nombreOperador = plan.operador.toLowerCase().trim();
//         let estiloOperador = "";
//         if (nombreOperador === "claro") estiloOperador = "background-color: #ff0000; color: white;";
//         else if (nombreOperador === "movistar") estiloOperador = "background-color: #008000; color: white;";
//         else if (nombreOperador === "tigo") estiloOperador = "background-color: #0000ff; color: white;";
//         else if (nombreOperador === "wom") estiloOperador = "background-color: #8509f8; color: white;";
//         else if (nombreOperador === "virgin") estiloOperador = "background-color: #ff00bf; color: white;";

//         // Color según título
//         const tituloPrincipal = plan.titulo.toLowerCase();
//         let estiloTitulo = "";
//         if (tituloPrincipal.includes("premium")) estiloTitulo = "color: gold;";
//         else if (tituloPrincipal.includes("básico")) estiloTitulo = "color: silver;";
//         else if (tituloPrincipal.includes("pro")) estiloTitulo = "color: #00bfff;";

//             card.innerHTML = `
//               <section>
//                 <h3 style="${estiloOperador}">${plan.titulo}</h3>
//                 <p>${plan.descripcion}</p>
//                 <p>${plan.red}</p>
//                 <p>$<strong>${plan.precio}</strong></p>
//               </section>
//             `;
//             contenedor.appendChild(card);
//         });

//     } catch (error) {
//         console.error("Error:", error);
//     }
// };
// cargarDatos();
// }
// // Ejecución



// document.addEventListener("DOMContentLoaded", iniciarHogar);