console.log("JS funcionando");
document.addEventListener("DOMContentLoaded", () => {
  // 1. CONFIGURACIÓN DE URL Y RUTAS
  const ruta = window.location.pathname.toLowerCase();
  const urlBase = "./assets/Benchmarking.xlsx"; // Excel completo en /public
  const rutasMap = {
    "postpago": "PREPAGO - CANAL TAT",
    "prepago": "MOVIL - CANAL PDV",
    "hogar": "HOGAR - CANAL CALLE"
  };

  // 2. IDENTIFICAR QUÉ PÁGINA MOSTRAR
  const claveEncontrada = Object.keys(rutasMap).find(key => ruta.includes(key));
  const hoja = claveEncontrada ? rutasMap[claveEncontrada] : "PREPAGO-CANAL TAT";

  const contenedor = document.getElementById("contenedor-planes");

  // 3. FUNCIÓN PRINCIPAL PARA CARGAR DATOS
  const cargarDatos = async () => {
    try {
      const res = await fetch(urlBase);

console.log("Fetch status:", res.status);
  console.log("Fetch ok:", res.ok);
  const contentType = res.headers.get("content-type");
  console.log("Content-Type:", contentType);


      if (!res.ok) throw new Error("No se pudo descargar el Excel");

      const buffer = await res.arrayBuffer();
      const libro = XLSX.read(buffer, { type: 'array' });
      const contenidoHoja = libro.Sheets[hoja];
      if (!contenidoHoja) throw new Error(`La hoja '${hoja}' no existe en el Excel"`);

      // Convertimos a JSON y normalizamos nombres de columnas
      const data = XLSX.utils.sheet_to_json(contenidoHoja).map(fila => ({
        operador: fila.Operador || fila.operador || "",
        titulo: fila.Titulo || fila.titulo || "",
        descripcion: fila.Descripcion || fila.descripcion || "",
        dias: fila.Dias || fila.dias || "",
        precio: fila.Precio || fila.precio || ""
      }));

      contenedor.innerHTML = "";

      // 4. Generar tarjetas
      data.forEach(plan => {
        const card = document.createElement("div");
        card.classList.add("paquetes");

        // Color según operador
        const nombreOperador = plan.operador.toLowerCase().trim();
        let estiloOperador = "";
        if (nombreOperador === "rojo") estiloOperador = "background-color: #ff0000; color: white;";
        else if (nombreOperador === "verde") estiloOperador = "background-color: #008000; color: white;";
        else if (nombreOperador === "azul") estiloOperador = "background-color: #0000ff; color: white;";

        // Color según título
        const tituloPrincipal = plan.titulo.toLowerCase();
        let estiloTitulo = "";
        if (tituloPrincipal.includes("premium")) estiloTitulo = "color: gold;";
        else if (tituloPrincipal.includes("básico")) estiloTitulo = "color: silver;";
        else if (tituloPrincipal.includes("pro")) estiloTitulo = "color: #00bfff;";

        // HTML de la tarjeta
        card.innerHTML = `
          <section>
            <h2 style="${estiloOperador}">${plan.operador}</h2>
            <h2 class="titulo-paquetes" style="${estiloTitulo}">${plan.titulo}</h2>
            <div>
            <p>${plan.paquete}</p>
              <p>${plan.descripcion}</p>
              <p>${plan.dias} días</p>
              <strong>$${plan.precio}</strong>
            </div>
          </section>
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
