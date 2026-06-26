import inquirer from 'inquirer';
import chalk from 'chalk';
import { TiendaController } from '../controller/TiendaController.js';
import { RopaHombre } from '../class/RopaHombre.js';
// IMPORTACIÓN CLAVE: Traemos el archivo individual de tu amigo
import { menuInterfazPublico } from './Catalogo.js'; 

const controlador = new TiendaController();

export class Menu {
    async getMenu() {
        console.clear();
        console.log(chalk.bold.cyan("================================================="));
        console.log(chalk.bold.cyan("     👔 SISTEMA DE GESTIÓN DE TIENDA DE ROPA 👔   "));
        console.log(chalk.bold.cyan("================================================="));
        
        const opcion = await inquirer.prompt([
            {
                type: 'select',
                name: 'accion',
                message: 'Seleccione el módulo al que desea ingresar:',
                choices: [
                    '1. Ver Catálogo Público', 
                    '2. Panel de Administración', 
                    '3. Cerrar Sistema'
                ]
            }
        ]);

        if (opcion.accion.includes('1')) {
            // Mandamos a llamar al archivo individual de tu amigo
            // Le pasamos como parámetro () => this.getMenu() para que cuando él le dé "Volver", regrese aquí
            await menuInterfazPublico(() => this.getMenu()); 
        } else if (opcion.accion.includes('2')) {
            await this.MenuAdmin(); 
        } else {
            console.log(chalk.yellow('\nCerrando el sistema. ¡Nos vemos! 👋\n'));
            process.exit();
        }
    }

    async MenuAdmin() {
        console.clear();
        console.log(chalk.bold.magenta("========================================="));
        console.log(chalk.bold.magenta("     ⚙️ PANEL DE CONTROL (BACKEND) ⚙️     "));
        console.log(chalk.bold.magenta("=========================================\n"));
        
        const opcion = await inquirer.prompt([
            {
                type: 'select',
                name: 'accion',
                message: 'Seleccione una operación:',
                choices: ['Ver Inventario', 'Ingresar Nueva Prenda ', 'Volver al Menú']
            }
        ]);

        if (opcion.accion === 'Ver Inventario') {
            const inventario = controlador.ObtenerCatalogo();
            if (inventario.length === 0) {
                console.log(chalk.yellow("El inventario está vacío."));
            } else {
                inventario.forEach(p => console.log(p.ObtenerDetalles()));
            }
            await inquirer.prompt([{ type: 'input', name: 'enter', message: '\nPresiona Enter para continuar...' }]);
            await this.MenuAdmin();
        } 
        else if (opcion.accion === 'Nueva Prenda ') {
            const datos = await inquirer.prompt([
                { type: 'input', name: 'id', message: 'ID único de prenda (Ej: 001):' },
                { type: 'input', name: 'nombre', message: 'Nombre del artículo:' },
                { type: 'number', name: 'precio', message: 'Precio en dólares ($):' },
                { type: 'number', name: 'stock', message: 'Cantidad inicial (Stock):' },
                { type: 'input', name: 'corte', message: 'Categoría o Sección:' }
            ]);

            const nuevaRopa = new RopaHombre(datos.id, datos.nombre, datos.precio, datos.stock, datos.corte);
            controlador.AgregarPrenda(nuevaRopa);
            
            console.log(chalk.green("\n✔ Prenda guardada exitosamente en la base de datos. 💾\n"));
            await inquirer.prompt([{ type: 'input', name: 'enter', message: 'Presiona Enter para continuar...' }]);
            await this.MenuAdmin();
        } else {
            await this.getMenu();
        }
    }
}