// /javascript/postpago.js

import { getDatos } from './excel.js';

// Utilidad: normaliza claves problemáticas (espacios extra, saltos de línea)
function normalizeKey(key) {
  if (!key) return '';
  return String(key).replace(/\s+/g, ' ').replace(/\r?\n/g, ' ').trim();
}

// Utilidad: obtiene el valor probando varias posibles claves
function getField(item, candidates, fallback = 'N/A') {
  for (const raw of candidates) {
    const norm = normalizeKey(raw);
    // Intento exacto
    if (item.hasOwnProperty(norm)) {
      const v = item[norm];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    // Intento buscando claves equivalentes en el objeto (por si vienen sin normalizar)
    for (const k of Object.keys(item)) {
      if (normalizeKey(k) === norm) {
        const v = item[k];
        if (v !== undefined && v !== null && v !== '') return v;
      }
    }
  }
  return fallback;
}

async function cargarContenido() {
  console.log("Cargando información...");
  const datos = await getDatos('MOVIL - CANAL PDV');
  console.log("Datos recibidos:", datos);

  const contenedor = document.getElementById('contenedor-planes');
  if (!contenedor) return;

  if (!Array.isArray(datos) || datos.length === 0) {
    contenedor.innerHTML = "<h3>No hay datos para mostrar. Revisa la consola (F12).</h3>";
    return;
  }

  // Filtrar operadores válidos
  const datosFiltrados = datos.filter(item =>
    item.Operador && item.Operador !== 'Sin Operador'
  );

  // Ordenar por Operador
  datosFiltrados.sort((a, b) => String(a.Operador).localeCompare(String(b.Operador)));

  // Colores por operador
  const coloresOperadores = {
    "Claro": "#e63946",
    "Movistar": "#2dc653",
    "Tigo": "#1d70b8",
    "WOM": "#7b2fff",
    "Virgin Mobile": "#ff6b00",
    "Somos": "#000000"
  };

  // Títulos por operador
  const titulosProOperador = {
    "Claro": "Planes Móvil C",
    "Movistar": "Planes Móvil M",
    "Tigo": "Planes Móvil T",
    "WOM": "Planes Móvil W",
    "Virgin Mobile": "Planes Móvil V",
    "Somos": "Planes Móvil S"
  };

  // Agrupar por Operador
  const porOperador = {};
  for (const item of datosFiltrados) {
    const op = item.Operador;
    if (!porOperador[op]) porOperador[op] = [];
    porOperador[op].push(item);
  }

  // Render
  contenedor.innerHTML = Object.entries(porOperador)
    .map(([operador, items]) => {
      const color = coloresOperadores[operador] || '#333';
      const tituloDinamico = titulosProOperador[operador] || `Planes ${operador}`;

      const cards = items.map((item) => {
        // Campos con posibles variaciones de nombre desde Excel
        const cantidadGB = getField(item, ['Cantidad de GB']);
        const mesesDescuento = getField(item, ['Meses de Descuento']);
        const appsDespues = getField(item, ['Apps que se pueden seguir usando terminada la capacidad de navegación del plan']);
        const campania = getField(item, ['Campaña Oferta o Descuento', 'Campaña', 'Campaña Oferta', 'Campaña Oferta o Descuento']);
        const minutosLDI = getField(item, ['Minutos LDI Paises', 'Minutos LDI Países', 'Minutos LDI']);
        const tarifaTotal = getField(item, [
          'CFM Con Impuesto Total Tarifa',
          'CFM Con Impuesto  Total Tarifa',
          'CFM Con Impuesto',
          'Total Tarifa'
        ]);

        return `
          <div class="card-wrapper">
            <div class="tittle-paquetes" style="border-top: 4px solid ${color};">
              <h2 style="color: ${color};">
                <strong>Plan:</strong> ${cantidadGB || 'N/A'}
              </h2>
            </div>
            <div class="content">
              <p><strong>Navegación:</strong> ${cantidadGB || 'N/A'} GB</p>
              <p><strong>Meses de Descuento:</strong> ${mesesDescuento}</p>
              <p><strong>Apps después del plan:</strong> ${appsDespues}</p>
              <p><strong>Campaña:</strong> ${campania}</p>
              <p><strong>Minutos Países:</strong> ${minutosLDI}</p>
              <p><strong style="color:red; font-size: 1.5em; font-weight: bold;">
                $ ${tarifaTotal}
              </strong></p>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="operador-section">
          <h1 style="color: ${color}">${tituloDinamico}</h1>
          <div class="cards-container">
            ${cards}
          </div>
        </div>
      `;
    })
    .join('');
}

cargarContenido();