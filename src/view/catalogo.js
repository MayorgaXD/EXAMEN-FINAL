import inquirer from 'inquirer';
import chalk from 'chalk';
import { TiendaController } from '../controller/TiendaController.js';

const controlador = new TiendaController();

const colorBorde = chalk.hex('#708090');       
const colorTitulo = chalk.hex('#98FF98');      
const colorClave = chalk.hex('#E0B0FF');      
const colorTexto = chalk.hex('#F0F8FF');       
const colorPrecio = chalk.hex('#FFD700');      
const colorStock = chalk.hex('#87CEEB');      
const colorAviso = chalk.hex('#FF7F50');       

function mostrarCatalogoEstilizado() {
    console.clear();
    
    console.log(colorBorde("┌───────────────────────────────────────────────────────────────┐"));
    console.log(`${colorBorde('│')} ${colorTitulo("📂  C A T Á L O G O   P Ú B L I C O  ( V I S T A )".padEnd(61))} ${colorBorde('│')}`);
    console.log(`${colorBorde('│')} ${chalk.gray("Sincronizado directamente con el inventario central.".padEnd(61))} ${colorBorde('│')}`);
    console.log(colorBorde("└───────────────────────────────────────────────────────────────┘\n"));

    const anchoID = 12;
    const anchoNombre = 25;
    const anchoPrecio = 10;
    const anchoStock = 8;

    console.log(colorBorde(`┌${'─'.repeat(anchoID)}┬${'─'.repeat(anchoNombre)}┬${'─'.repeat(anchoPrecio)}┬${'─'.repeat(anchoStock)}┐`));

    const hID = colorClave("ID PRENDA".padEnd(anchoID));
    const hNombre = colorClave("ARTÍCULO".padEnd(anchoNombre));
    const hPrecio = colorClave("PRECIO".padEnd(anchoPrecio));
    const hStock = colorClave("STOCK".padEnd(anchoStock));
    console.log(`${colorBorde('│')}${hID}${colorBorde('│')}${hNombre}${colorBorde('│')}${hPrecio}${colorBorde('│')}${hStock}${colorBorde('│')}`);

    console.log(colorBorde(`├${'─'.repeat(anchoID)}┼${'─'.repeat(anchoNombre)}┼${'─'.repeat(anchoPrecio)}┼${'─'.repeat(anchoStock)}┤`));

    const baseDeDatosReales = controlador.ObtenerCatalogo();

    if (baseDeDatosReales.length === 0) {
        const mensajeVacio = " El almacén está completamente vacío... ".padEnd(anchoID + anchoNombre + anchoPrecio + anchoStock + 3);
        console.log(`${colorBorde('│')}${chalk.hex('#FF6B6B')(mensajeVacio)}${colorBorde('│')}`);
    } else {
        baseDeDatosReales.forEach(item => {
            const vID = colorClave(String(item.id).padEnd(anchoID));
            const vNombre = colorTexto(String(item.nombre).padEnd(anchoNombre));
            const vPrecio = colorPrecio(`$${item.precio}`.padEnd(anchoPrecio));
            const vStock = colorStock(String(item.stock).padEnd(anchoStock));
            
            console.log(`${colorBorde('│')}${vID}${colorBorde('│')}${vNombre}${colorBorde('│')}${vPrecio}${colorBorde('│')}${vStock}${colorBorde('│')}`);
        });
    }

    console.log(colorBorde(`└${'─'.repeat(anchoID)}┴${'─'.repeat(anchoNombre)}┴${'─'.repeat(anchoPrecio)}┴${'─'.repeat(anchoStock)}┘`));
    console.log(colorAviso("\n✨ Nota: Los precios mostrados no incluyen IVA."));
    console.log(colorBorde("─────────────────────────────────────────────────────────────────\n"));
}

export async function menuInterfazPublico(regresarAlMenuMaestro) {
    mostrarCatalogoEstilizado();

    const respuestas = await inquirer.prompt([
        {
            type: 'select',
            name: 'opcion',
            message: '¿Qué deseas hacer ahora, mae?',
            choices: [
                { name: '🛍️  Comprar una Prenda', value: 'COMPRAR' }, 
                { name: '🔄 Sincronizar catálogo', value: 'REFRESCAR' },
                { name: '⬅️  Volver al Inicio', value: 'VOLVER' }
            ]
        }
    ]);

    if (respuestas.opcion === 'COMPRAR') {
        await controlador.ProcesarCompraCliente();
        await inquirer.prompt([{ type: 'input', name: 'enter', message: '\nPresiona Enter para continuar...' }]);
        await menuInterfazPublico(regresarAlMenuMaestro);
    } 
    else if (respuestas.opcion === 'REFRESCAR') {
        controlador.CargarDatos(); 
        await menuInterfazPublico(regresarAlMenuMaestro);
    } 
    else {
        await regresarAlMenuMaestro(); 
    }
}