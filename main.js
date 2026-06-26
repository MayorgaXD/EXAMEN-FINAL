import { TiendaController } from './src/controller/TiendaController.js';

console.log("=========================================");
console.log("  ¡PROBANDO CONFIGURACIÓN DE LA TIENDA!  ");
console.log("=========================================");

const test = new TiendaController();
console.log("Base de datos JSON leída correctamente.");
console.log("Prendas cargadas:", test.ObtenerCatalogo().length);