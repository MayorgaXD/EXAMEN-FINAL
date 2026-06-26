import inquirer from 'inquirer';
import chalk from 'chalk';
import { TiendaController } from '../controller/TiendaController.js';
import { RopaHombre } from '../class/RopaHombre.js';
import { menuInterfazPublico } from './Catalogo.js'; 

const controlador = new TiendaController();

// Colores Aesthetic para el Menú Principal y Admin
const neonFucsia = chalk.hex('#FF007F').bold;
const neonCian = chalk.hex('#00F5FF');
const pastelMorado = chalk.hex('#D4B2FF');
const oroAesthetic = chalk.hex('#FFEE55');

export class Menu {
    async getMenu() {
        console.clear();
        console.log(neonFucsia("┌─────────────────────────────────────────────────┐"));
        console.log(`${neonFucsia('│')} ${neonCian("    🔮  V A P O R W A V E   C L O T H I N G  🔮   ")} ${neonFucsia('│')}`);
        console.log(`${neonFucsia('│')} ${pastelMorado("        - S I S T E M A   C E N T R A L -        ")} ${neonFucsia('│')}`);
        console.log(neonFucsia("└─────────────────────────────────────────────────┘"));
        
        const opcion = await inquirer.prompt([
            {
                type: 'select',
                name: 'accion',
                message: 'Selecciona el entorno de ejecución:',
                choices: [
                    '✨ Módulo 1: Catálogo y Compras (Cliente)', // Al entrar aquí pueden ver la tabla y comprar de un solo
                    '⚙️  Módulo 2: Panel de Inventario (Admin Backend)', 
                    '❌ Módulo 3: Salir de la Terminal'
                ]
            }
        ]);

        if (opcion.accion.includes('Módulo 1')) {
            await menuInterfazPublico(() => this.getMenu()); 
        } 
        else if (opcion.accion.includes('Módulo 2')) {
            await this.MenuAdmin(); 
        } 
        else {
            console.log(neonFucsia('\n[!] Desconectando servidores... ¡Nos vemos, mostro! 🌊\n'));
            process.exit();
        }
    }

    async MenuAdmin() {
        console.clear();
        console.log(pastelMorado("┌─────────────────────────────────────────┐"));
        console.log(`${pastelMorado('│')} ${oroAesthetic("   🛠️  BACKEND DATABASE MANAGEMENT  🛠️   ")} ${pastelMorado('│')}`);
        console.log(pastelMorado("└─────────────────────────────────────────┘\n"));
        
        const opcion = await inquirer.prompt([
            {
                type: 'select',
                name: 'accion',
                message: 'Operación del Administrador:',
                choices: ['⚡ Inspeccionar Base de Datos', '➕ Agregarnueva prenda', '⬅️  Regresar al menu principal']
            }
        ]);

        if (opcion.accion === '⚡ Inspeccionar Base de Datos') {
            controlador.CargarDatos(); 
            const inventario = controlador.ObtenerCatalogo();
            if (inventario.length === 0) {
                console.log(chalk.hex('#FF6B6B')("\n[Alerta] No existen registros en data/inventario.json\n"));
            } else {
                console.log(neonCian("\n─── 📦 DATA POOL ACTUAL ───"));
                inventario.forEach(p => console.log(pastelMorado(" > ") + chalk.white(p.ObtenerDetalles())));
            }
            await inquirer.prompt([{ type: 'input', name: 'enter', message: '\nPresiona Enter para continuar...' }]);
            await this.MenuAdmin();
        } 
        else if (opcion.accion === '➕ Inyectar nueva prenda al JSON') {
            const datos = await inquirer.prompt([
                { type: 'input', name: 'id', message: 'UUID / ID de control:' },
                { type: 'input', name: 'nombre', message: 'Nombre de la prenda:' },
                { type: 'number', name: 'precio', message: 'Precio de venta ($):' },
                { type: 'number', name: 'stock', message: 'Unidades de stock entrante:' },
                { type: 'input', name: 'corte', message: 'Categoría/Sección:' }
            ]);

            const nuevaRopa = new RopaHombre(datos.id, datos.nombre, datos.precio, datos.stock, datos.corte);
            controlador.AgregarPrenda(nuevaRopa);
            
            console.log(neonCian("\n✔️ System: Objeto instanciado y persistido en JSON con éxito. 💾\n"));
            await inquirer.prompt([{ type: 'input', name: 'enter', message: 'Presiona Enter para continuar...' }]);
            await this.MenuAdmin();
        } else {
            await this.getMenu();
        }
    }
}