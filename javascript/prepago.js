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

    // Filtrar operadores válidos
    const datosFiltrados = datos.filter(item =>
        item.Operador && item.Operador !== 'Sin Operador'
    );

    // Ordenar alfabéticamente por operador
    datosFiltrados.sort((a, b) => a.Operador.localeCompare(b.Operador));

    // Colores por operador
    const coloresOperadores = {
        "Claro": "#e63946",
        "Movistar": "#2dc653",
        "Tigo": "#1d70b8",
        "WOM": "#7b2fff",
        "Virgin Mobile": "#ff6b00",
        "Somos": "#000000"
    };

    // Títulos dinámicos por operador
    const titulosProOperador = {
        "Claro": "Planes Movil C",
        "Movistar": "Planes Movil M",
        "Tigo": "Planes Movil T",
        "WOM": "Planes Movil W",
        "Virgin Mobile": "Planes Movil V",
        "Somos": "Planes Movil S"
    };

    // Agrupar por operador
    const porOperador = {};
    datosFiltrados.forEach(item => {
        if (!porOperador[item.Operador]) porOperador[item.Operador] = [];
        porOperador[item.Operador].push(item);
    });

    // Renderizado del contenido por operador
    contenedor.innerHTML = Object.entries(porOperador)
        .map(([operador, items]) => {

            const color = coloresOperadores[operador] || '#5f5c5c';
            const tituloDinamico = titulosProOperador[operador] || `Planes ${operador}`;

            const cards = items.map(item => `
                <div class="card-wrapper">
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

                        <p>
                          <strong style="color:red; font-size: 1.5em; font-weight: bold;">
                          $ ${item['Precio de la Recarga'] || 'Consultar'}
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
                </div>
            `;
        })
        .join('');
}

cargarContenido();