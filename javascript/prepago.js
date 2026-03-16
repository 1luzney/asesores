// /javascript/prepago.js

import { getDatos } from './excel.js';

async function cargarContenido() {
    console.log("Cargando información...");
    const datos = await getDatos('PREPAGO - CANAL TAT');
    console.log("Datos recibidos:", datos);

    const contenedor = document.getElementById('contenedor-planes');
    if (!contenedor) return;

    if (datos.length === 0) {
        contenedor.innerHTML = "<h3>No hay datos para mostrar. Revisa la consola (F12).</h3>";
        return;
    }

    const datosFiltrados = datos.filter(item =>
        item.Operador && item.Operador !== 'Sin Operador'
    );

    datosFiltrados.sort((a, b) => a.Operador.localeCompare(b.Operador));

    const coloresOperadores = {
        "Claro": "#f8091d",
        "Movistar": "#38ca5d",
        "Tigo": "#1d70b8",
        "WOM": "#7b2fff",
        "Virgin": "#ff6b00",
        "Somos": "#000000"
    };

    const titulosProOperador = {
        "Claro": "Paquetes Movil C",
        "Movistar": "Paquetes Movil M",
        "Tigo": "Paquetes Movil T",
        "WOM": "Paquetes Movil W",
        "Virgin": "Paquetes Movil V",
        "Somos": "Paquetes Movil S"
    };

    const TituloSelector = {
        "Claro": "C",
        "Movistar": "M",
        "Tigo": "T",
        "WOM": "W",
        "Virgin": "V",
        "Somos": "S",
    };

    const porOperador = {};
    datosFiltrados.forEach(item => {
        if (!porOperador[item.Operador]) porOperador[item.Operador] = [];
        porOperador[item.Operador].push(item);
    });

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
                        ${operadoresDisponibles.map(op => `<option value="${op}">${TituloSelector[op] || op}</option>`).join('')}
                    </select>
                </div>
                <div class="selector-grupo">
                    <label for="op2">Operador 2</label>
                    <select id="op2">
                        <option value="">-- Selecciona --</option>
                        ${operadoresDisponibles.map(op => `<option value="${op}">${TituloSelector[op] || op}</option>`).join('')}
                    </select>
                </div>
                <div class="selector-grupo">
                    <label for="op3">Operador 3</label>
                    <select id="op3">
                        <option value="">-- Selecciona --</option>
                        ${operadoresDisponibles.map(op => `<option value="${op}">${TituloSelector[op] || op}</option>`).join('')}
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
        const color = coloresOperadores[operador] || '#5f5c5c';
        const tituloDinamico = titulosProOperador[operador] || `Planes ${operador}`;

        function formatearPrecio(valor) {
            return new Intl.NumberFormat('es-CO').format(Number(valor));
        }

        const cards = items.map(item => `
            <div class="card-wrapper" style="background-color: ${color};">
                <div class="tittle-paquetes" style="border-top: 4px solid ${color};">
                    <h2 style="color: ${color};">
                        <strong>Plan:</strong> ${item['Cantidad de GB'] || 'N/A'}
                    </h2>
                </div>
                <div class="content">
                    <p>Navegación</p>
                    <h2>${item['Cantidad de GB'] || 'N/A'}</h2>
                    <p><strong>Redes Sociales Incluidas:</strong>
                       ${item['Apps que se pueden seguir usando terminada la capacidad de navegación del plan'] || 'N/A'}
                    </p>
                    <p><strong>Paquete:</strong> ${item.Paquete || 'General'}</p>
                    <p><strong>Campaña:</strong> ${item['Expecifica: Campañas Promociones o Bono de Bienvenida'] || 'N/A'}</p>
                    <p class="precio">
                        <strong style="color:white; background-color:rgba(255, 0, 0, 0.70); font-size:1.5em; font-weight:bold; padding:5px 10px; border-radius:20px;">
                        $ ${item['Precio de la Recarga'] ? formatearPrecio(item['Precio de la Recarga']) : 'Consultar'}
                        </strong>
                    </p>
                    <p><small>Vigencia: ${item['Días de Vigencia'] || 'Dias'} días</small></p>
                </div>
            </div>
        `).join('');

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
