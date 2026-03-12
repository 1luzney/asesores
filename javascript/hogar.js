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

    // Filtrar operadores válidos
    const datosFiltrados = datos.filter(item =>
        item.Operador && item.Operador !== 'Sin Operador'
    );

    // Orden alfabético
    datosFiltrados.sort((a, b) => a.Operador.localeCompare(b.Operador));

    // Colores por operador
    const coloresOperadores = {
        "Claro": "#e63946",
        "Movistar": "#0da533",
        "Tigo": "#1d70b8",
        "WOM": "#7b2fff",
        "Virgin Mobile": "#ff6b00",
        "Somos": "#000000",
        "Legon": "#ffb703",
        "Tu Cable": "#5f3505",
        "Plus": "#0c5a5a"
    };

    // Títulos dinámicos por operador
    const titulosProOperador = {
        "Claro": "Planes Movil C",
        "Movistar": "Planes Movil M",
        "Tigo": "Planes Movil T",
        "WOM": "Planes Movil W",
        "Virgin Mobile": "Planes Movil V",
        "Somos": "Planes Movil S",
        "Legon": "Planes L",
        "Tu Cable": "Planes TC",
        "Plus": "Planes P"
    };





    // Agrupar por operador
    const porOperador = {};
    datosFiltrados.forEach(item => {
        if (!porOperador[item.Operador]) porOperador[item.Operador] = [];
        porOperador[item.Operador].push(item);
    });

    // Renderizar HTML final
    contenedor.innerHTML = Object.entries(porOperador)
        .map(([operador, items]) => {

            const color = coloresOperadores[operador] || '#333';
            const tituloDinamico = titulosProOperador[operador] || `Planes ${operador}`;

            function formatearPrecio(valor) {
                return new Intl.NumberFormat('es-CO').format(Number(valor));
            }

            const cards = items.map(item => `
                <div class="card-wrapper">
                    <div class="tittle-paquetes" style="border-top: 4px solid ${color};">
                        <h2 style="color: ${color};">
                            <strong></strong> ${item['Paquete'] || 'N/A'}
                        </h2>
                    </div>
                    <div class="content">
                        <h3>Precio Mes</h3>
                        <p>
                            <strong style="color:red; font-size: 1.5em; font-weight: bold;">
                            $ ${item[' Precio '] ? formatearPrecio(item[' Precio ']) : 'Consultar'}
                            </strong>
                        </p>

                        <p>${item['Velocidad del @'] || 'N/A'}</p>

                        <p><strong>TV: </strong> ${item['Tipo de TV'] || 'General'}</p>
                        <p><strong>Decos: </strong> ${item['Cantidad de Decos incluidos'] || 'N/A'}</p>
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
        })
        .join('');
}

cargarContenido();