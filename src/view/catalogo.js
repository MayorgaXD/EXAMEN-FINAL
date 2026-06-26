import inquirer from 'inquirer';
import chalk from 'chalk';
import { TiendaController } from '../controller/TiendaController.js';

const controlador = new TiendaController();

const colorBorde = chalk.hex('#4682B4');       
const colorClave = chalk.hex('#50C878');       
const colorTexto = chalk.hex('#00008B');    
const colorAviso = chalk.yellow;

function mostrarCatalogoEstilizado() {
    console.clear();
    
    console.log(colorBorde("================================================================="));
    console.log(colorClave("                       CATÁLOGO PÚBLICO                          "));
    console.log(colorTexto("          (Lista de información disponible en el inventario)      "));
    console.log(colorBorde("=================================================================\n"));

    const anchoID = 12;
    const anchoNombre = 25;
    const anchoPrecio = 10;
    const anchoStock = 8;

    console.log(colorBorde(`┌${'─'.repeat(anchoID)}┬${'─'.repeat(anchoNombre)}┬${'─'.repeat(anchoPrecio)}┬${'─'.repeat(anchoStock)}┐`));

    const hID = colorClave("ID Objeto".padEnd(anchoID));
    const hNombre = colorClave("Nombre Prenda".padEnd(anchoNombre));
    const hPrecio = colorClave("Precio".padEnd(anchoPrecio));
    const hStock = colorClave("Stock".padEnd(anchoStock));
    console.log(`${colorBorde('│')}${hID}${colorBorde('│')}${hNombre}${colorBorde('│')}${hPrecio}${colorBorde('│')}${hStock}${colorBorde('│')}`);

    console.log(colorBorde(`├${'─'.repeat(anchoID)}┼${'─'.repeat(anchoNombre)}┼${'─'.repeat(anchoPrecio)}┼${'─'.repeat(anchoStock)}┤`));

    const baseDeDatosReales = controlador.ObtenerCatalogo();

    if (baseDeDatosReales.length === 0) {
        const mensajeVacio = " No hay ropa registrada en el backend ".padEnd(anchoID + anchoNombre + anchoPrecio + anchoStock + 3);
        console.log(`${colorBorde('│')}${chalk.red(mensajeVacio)}${colorBorde('│')}`);
    } else {
        baseDeDatosReales.forEach(item => {
            const vID = colorTexto(String(item.id).padEnd(anchoID));
            const vNombre = colorTexto(String(item.nombre).padEnd(anchoNombre));
            const vPrecio = colorTexto(`$${item.precio}`.padEnd(anchoPrecio));
            const vStock = colorTexto(String(item.stock).padEnd(anchoStock));
            
            console.log(`${colorBorde('│')}${vID}${colorBorde('│')}${vNombre}${colorBorde('│')}${vPrecio}${colorBorde('│')}${vStock}${colorBorde('│')}`);
        });
    }

    console.log(colorBorde(`└${'─'.repeat(anchoID)}┴${'─'.repeat(anchoNombre)}┴${'─'.repeat(anchoPrecio)}┴${'─'.repeat(anchoStock)}┘`));
    console.log(colorAviso("\n* OJO : Este catalogo es meramente visual. nada se puede cambiar."));
    console.log(colorBorde("=================================================================\n"));
}

// Ponemos export para poder llamarlo desde tu menú principal
export async function menuInterfazPublico(regresarAlMenuMaestro) {
    mostrarCatalogoEstilizado();

    const respuestas = await inquirer.prompt([
        {
            type: 'select',
            name: 'opcion',
            message: 'Seleccione una opción:',
            choices: [
                { name: '🔄 Actualizar Vista', value: 'REFRESCAR' },
                { name: '⬅ Volver al Menú Maestro', value: 'VOLVER' }
            ]
        }
    ]);

    if (respuestas.opcion === 'REFRESCAR') {
        controlador.CargarDatos(); 
        await menuInterfazPublico(regresarAlMenuMaestro);
    } else {
        // En vez de cerrar el programa, ejecuta la función para volver a tu menú
        await regresarAlMenuMaestro(); 
    }
}