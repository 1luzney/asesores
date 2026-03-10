// javascript/data.js
export async function getDatos(nombreHoja) {
    const response = await fetch('../assets/Benchmarking.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const hoja = workbook.Sheets[nombreHoja];
    
    // El parámetro 'range' le dice: "usa la fila 1 como encabezado" (la fila 2 en Excel)
    const json = XLSX.utils.sheet_to_json(hoja, { range: 1 }); 
    
    console.log("Datos limpios:", json[0]); // Esto te mostrará los nombres correctos
    return json;
}





//  <p><strong style="color:red; font-size: 1.5em; font-weight: bold;">$ ${item[' Precio '] || 'Consultar'}</strong></p>
//                     <p><strong></strong> ${item['Velocidad del @'] || 'N/A'}</p>
//                     <p><strong style="color:red;>TV: </strong> ${item['Tipo de TV'] || 'General'}</p>
//                     <p><strong style="color:red;>Decos: </strong> ${item['Cantidad de Decos incluidos'] || 'N/A'}</p>
//                     <p><strong style="color:red;>OTTs Incuidas: </strong> ${item['"OTT Incluidas (Nombres de las OTT)"'] || 'N/A'}</p>