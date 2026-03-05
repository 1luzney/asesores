console.log("JS funcionando");
document.addEventListener("DOMContentLoaded", () => {
  // 1. CONFIGURACIÓN DE URL Y RUTAS
  
  const ruta = window.location.pathname.toLowerCase();
  
  // REEMPLAZA ESTA URL con tu link directo de OneDrive (Paso del resid y authkey)
  //const urlBase = "https://onedrive.live.com/download.aspx?resid=TU_RESID&authkey=TU_AUTHKEY";
// const urlBase = "https://file-examples-com.github.io/uploads/2017/02/file_example_XLSX_10.xlsx";
const urlBase = "../javascript/pruebaExcel.xlsx";
  const rutasMap = {
    "postpago": "Postpago",
    "prepago" : "Prepago",
    "hogar"   : "Hogar"
  };

  // 2. IDENTIFICAR QUÉ PÁGINA MOSTRAR
  const claveEncontrada = Object.keys(rutasMap).find(key => ruta.includes(key));
  const hoja = claveEncontrada ? rutasMap[claveEncontrada] : "Postpago";

  // Construimos la URL final con el parámetro de la hoja
  const url = urlBase;
  const contenedor = document.getElementById("contenedor-planes");

  // 3. FUNCIÓN PRINCIPAL PARA CARGAR DATOS
  const cargarDatos = async () => {
    try {
        // 1. Descargar el archivo de OneDrive como "arrayBuffer" (datos binarios)
        const res = await fetch(url);
        if (!res.ok) throw new Error("No se pudo descargar el Excel");
        
        const buffer = await res.arrayBuffer();

        // 2. Usar la librería XLSX para leer el archivo
        const libro = XLSX.read(buffer, { type: 'array' });

        // 3. Obtener la hoja específica (Postpago, Prepago o Hogar)
        // 'hoja' es la variable que ya definiste arriba en tu código
        const contenidoHoja = libro.Sheets[hoja]; 
        
        if (!contenidoHoja) {
            throw new Error(`La hoja '${hoja}' no existe en el Excel"`);
        }

        // 4. Convertir la hoja de Excel a formato JSON
        const data = XLSX.utils.sheet_to_json(contenidoHoja);
        console.log(data)

        // 5. Mostrar los datos (tu lógica de siempre)
        contenedor.innerHTML = "";
        data.forEach(plan => {
            const card = document.createElement("div");
            card.classList.add("plan-card");
            card.innerHTML = `
                <h2>${plan.titulo}</h2>
                <p>${plan.descripcion}</p>
                <p>${plan.dias} días</p>
                <strong>$${plan.precio}</strong>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error con el Excel:", error);
        contenedor.innerHTML = `<p>Error al leer el Excel: ${error.message}</p>`;
    }
};

  // Ejecutamos la función
  cargarDatos();
});
