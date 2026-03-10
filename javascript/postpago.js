import { getDatos } from './excel.js';

async function cargarContenido() {
    console.log("Cargando información...");
    const datos = await getDatos('MOVIL - CANAL PDV');
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
                        <strong>Plan:</strong> ${item['Cantidad de GB'] || 'N/A'}
                    </h2>
                </div>
                <div class="content">
                    <p><strong>Navegación:</strong> ${item['Cantidad de GB'] || 'N/A'} GB</p>
                    <p><strong>Meses de Descuento:</strong> ${item['Meses de Descuento'] || 'N/A'}</p>
                    <p><strong>Apps después del plan:</strong> ${item['Apps que se pueden seguir usando terminada la capacidad de navegación del plan'] || 'N/A'}</p>
                    <p><strong>Campaña:</strong> ${item['Campaña\r\nOferta o Descuento'] || 'N/A'}</p>
                    <p><strong>Minutos Países:</strong> ${item['Minutos LDI Paises'] || 'N/A'}</p>
                    <p"> <strong style="color:red; font-size: 1.5em; font-weight: bold;">$ ${item['CFM Con Impuesto\r\nTotal Tarifa'] || 'N/A'}</strong></p>
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

