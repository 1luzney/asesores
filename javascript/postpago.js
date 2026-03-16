// /javascript/postpago.js

import { getDatos } from './excel.js';

function normalizeKey(key) {
  if (!key) return '';
  return String(key).replace(/\s+/g, ' ').replace(/\r?\n/g, ' ').trim();
}

function getField(item, candidates, fallback = 'N/A') {
  for (const raw of candidates) {
    const norm = normalizeKey(raw);
    if (item.hasOwnProperty(norm)) {
      const v = item[norm];
      if (v !== undefined && v !== null && v !== '') return v;
    }
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

  const datosFiltrados = datos.filter(item =>
    item.Operador && item.Operador !== 'Sin Operador'
  );

  datosFiltrados.sort((a, b) => String(a.Operador).localeCompare(String(b.Operador)));

  const coloresOperadores = {
    "Claro": "#f5091d",
    "Movistar": "#2dc653",
    "Tigo": "#1d70b8",
    "WOM": "#7b2fff",
    "Virgin Mobile": "#ff6b00",
    "Somos": "#0000005b"
  };

  const titulosProOperador = {
    "Claro": "Planes Móvil C",
    "Movistar": "Planes Móvil M",
    "Tigo": "Planes Móvil T",
    "WOM": "Planes Móvil W",
    "Virgin Mobile": "Planes Móvil V",
    "Somos": "Planes Móvil S"
  };

  const porOperador = {};
  for (const item of datosFiltrados) {
    const op = item.Operador;
    if (!porOperador[op]) porOperador[op] = [];
    porOperador[op].push(item);
  }

  const operadoresDisponibles = Object.keys(porOperador);

  // ─── SELECTOR UI ────────────────────────────────────────────────────────────
  const selectorHTML = `
      <div class="selector-comparar">
          <h2 class="selector-titulo">Mostrar 3 operadores</h2>
          <div class="selector-controles">
              <div class="selector-grupo">
                  <label for="op1">Operador 1</label>
                  <select id="op1">
                      <option value="">-- Selecciona --</option>
                      ${operadoresDisponibles.map(op => `<option value="${op}">${op}</option>`).join('')}
                  </select>
              </div>
              
              <div class="selector-grupo">
                  <label for="op2">Operador 2</label>
                  <select id="op2">
                      <option value="">-- Selecciona --</option>
                      ${operadoresDisponibles.map(op => `<option value="${op}">${op}</option>`).join('')}
                  </select>
              </div>
              <div class="selector-grupo">
                    <label for="op3">Operador 3</label>
                    <select id="op3">
                        <option value="">-- Selecciona --</option>
                        ${operadoresDisponibles.map(op => `<option value="${op}">${op}</option>`).join('')}
                    </select>
                </div>
          </div>
          <button id="btn-comparar">Mostrar</button>
          <button id="btn-limpiar" class="btn-secundario">Ver todos</button>
      </div>
      <div id="resultado-comparacion"></div>
  `;

  // ─── HELPER: renderiza un operador ──────────────────────────────────────────
  function renderOperador(operador, items) {
    const color = coloresOperadores[operador] || '#333';
    const tituloDinamico = titulosProOperador[operador] || `Planes ${operador}`;

    function formatearPrecio(valor) {
      return new Intl.NumberFormat('es-CO').format(Number(valor));
    }

    const cards = items.map((item) => {
      const cantidadGB    = getField(item, ['Cantidad de GB']);
      const mesesDescuento = getField(item, ['Meses de Descuento']);
      const appsDespues   = getField(item, ['Apps que se pueden seguir usando terminada la capacidad de navegación del plan']);
      const campania      = getField(item, ['Campaña Oferta o Descuento', 'Campaña', 'Campaña Oferta']);
      const minutosLDI    = getField(item, ['Minutos LDI Paises', 'Minutos LDI Países', 'Minutos LDI']);
      const tarifaTotal   = getField(item, ['CFM Con Impuesto Total Tarifa', 'CFM Con Impuesto  Total Tarifa', 'CFM Con Impuesto', 'Total Tarifa']);

      return `
        <div class="card-wrapper" style="background-color: ${color};">
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
            <p>
              <strong style="color:white; background-color:rgba(255, 0, 0, 0.70); font-size:1.5em; font-weight:bold; padding:5px 10px; border-radius:20px;">
              $ ${tarifaTotal ? formatearPrecio(tarifaTotal) : 'Consultar'}
              </strong>
            </p>
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
      </div>`;
  }

  // ─── RENDER TODOS ────────────────────────────────────────────────────────────
  function renderTodos() {
    const resultado = document.getElementById('resultado-comparacion');
    resultado.className = 'main-section';
    resultado.innerHTML = Object.entries(porOperador)
      .map(([operador, items]) => renderOperador(operador, items))
      .join('');
  }

  // ─── RENDER COMPARACIÓN SIDE BY SIDE ────────────────────────────────────────
  function renderComparacion(op1, op2, op3) {
    const resultado = document.getElementById('resultado-comparacion');
    resultado.className = 'comparacion-wrapper';

    if (!op1 && !op2 && !op3) {
      resultado.innerHTML = '<p class="aviso-selector">Selecciona al menos un operador.</p>';
      return;
    }

    const cols = [op1, op2, op3].filter(Boolean).map(op => {
      if (!porOperador[op]) return `<div class="col-comparacion"><p>Operador no encontrado.</p></div>`;
      return `<div class="col-comparacion">${renderOperador(op, porOperador[op])}</div>`;
    });

    resultado.innerHTML = cols.join('');
  }

  // ─── MONTAR VISTA SEGÚN TAMAÑO ───────────────────────────────────────────────
  function montarVista(esMobil) {
    if (esMobil) {
      contenedor.innerHTML = selectorHTML;
      renderTodos();

      document.getElementById('btn-comparar').addEventListener('click', () => {
        const op1 = document.getElementById('op1').value;
        const op2 = document.getElementById('op2').value;
        const op3 = document.getElementById('op3').value;
        renderComparacion(op1, op2, op3);
      });

      document.getElementById('btn-limpiar').addEventListener('click', () => {
        document.getElementById('op1').value = '';
        document.getElementById('op2').value = '';
        document.getElementById('op3').value = '';
        renderTodos();
      });
    } else {
      contenedor.className = 'main-section';
      contenedor.innerHTML = Object.entries(porOperador)
        .map(([operador, items]) => renderOperador(operador, items))
        .join('');
    }
  }

  // ─── INIT + LISTENER EN TIEMPO REAL ─────────────────────────────────────────
  const mediaQuery = window.matchMedia('(max-width: 480px)');

  montarVista(mediaQuery.matches);

  mediaQuery.addEventListener('change', (e) => {
    montarVista(e.matches);
  });
}

cargarContenido();
