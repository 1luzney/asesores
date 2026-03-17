// /javascript/hogar.js

import { getDatos } from './excel.js';

async function cargarContenido() {

    const datos = await getDatos('HOGAR - CANAL CALLE');
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
        "Claro": "#ff0015",
        "Movistar": "#0da533",
        "Tigo": "#1d70b8",
        "WOM": "#7b2fff",
        "Virgin Mobile": "#ff6b00",
        "Somos": "#00000096",
        "Legon": "#ffb703",
        "Tu Cable": "#5f3505",
        "Plus": "#0c5a5a",
        "Anserma": "#f80fb2",
        "Bitwan (INSITEL )": "#619cfa",
        "Otro": "#d9ff00",
        
    };

    const titulosProOperador = {
        "Claro": "Oferta Hogar C",
        "Movistar": "Oferta Hogar M",
        "Tigo": "Oferta Hogar T",
        "WOM": "Oferta Hogar W",
        "Virgin Mobile": "Oferta Hogar V",
        "Somos": "Oferta Hogar S",
        "Legon": "Oferta Hogar L",
        "Tu Cable": "Oferta Hogar TC",
        "Plus": "Oferta Hogar P",
        "Anserma": "Oferta Hogar A",
        "Bitwan (INSITEL )": "Oferta Hogar B",
        "Otro": "Oferta Hogar O"
    };

    const TituloSelector = {
        "Claro": "C",
        "Movistar": "M",
        "Tigo": "T",
        "WOM": "W",
        "Virgin Mobile": "V",
        "Somos": "S",
        "Legon": "L",
        "Tu Cable": "TC",
        "Plus": "P",
        "Anserma": "A",
        "Bitwand": "B"
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
        const color = coloresOperadores[operador] || '#333';
        const tituloDinamico = titulosProOperador[operador] || `Oferta Hogar ${operador}`;

        function formatearPrecio(valor) {
            return new Intl.NumberFormat('es-CO').format(Number(valor));
        }

        const cards = items.map(item => `
            <div class="card-wrapper" style="background-color: ${color};">
                <div class="tittle-paquetes" style="border-top: 4px solid ${color};">
                    <h2 style="color: ${color};">
                        <strong></strong> ${item['Paquete'] || 'N/A'}
                    </h2>
                </div>
                <div class="content">
                    <h3>Precio Mes</h3>
                    <p class="precio">
                        <span  class="precio-badge">
                        $ ${item[' Precio '] ? formatearPrecio(item[' Precio ']) : 'Consultar'}
                        </span>
                    </p>
                    <p>${item['Velocidad del @'] || 'N/A'}</p>
                    <p><strong>TV: </strong> ${item['Tipo de TV'] || 'General'}</p>
                    <p><strong>Decos: </strong> ${item['Cantidad de Decos incluidos'] || 'N/A'}</p>
                    <p><strong>Campaña: </strong> ${item['Campaña Expecifique la campaña o promoción, Tarifa especial, Descuentos. Etc'] || 'N/A'}</p>
                    <p><strong>Valores Agregados: </strong> ${item['Valores Agregados'] || 'N/A'}</p>
                    <p><strong>Observación: </strong> ${item['Observación'] || 'N/A'}</p>
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

    // ─── RENDER TODOS LOS OPERADORES ────────────────────────────────────────────
    // function renderTodos() {
    //     const resultado = document.getElementById('resultado-comparacion');
    //     resultado.className = 'main-section';
    //     resultado.innerHTML = Object.entries(porOperador)
    //         .map(([operador, items]) => renderOperador(operador, items))
    //         .join('');
    // }

    function renderTodos() {
    const resultado = document.getElementById('resultado-comparacion');
    // En móvil usa columna, en escritorio usa fila
    resultado.className = window.matchMedia('(max-width: 480px)').matches 
        ? 'main-section mobile' 
        : 'main-section';
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

    // Cambia automáticamente al redimensionar, sin recargar la página
    mediaQuery.addEventListener('change', (e) => {
        montarVista(e.matches);
    });
}

cargarContenido();
