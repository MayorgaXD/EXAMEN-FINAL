import inquirer from 'inquirer';
import chalk from 'chalk';
import { TiendaController } from '../controller/TiendaController.js';
import { RopaHombre } from '../class/RopaHombre.js';

const controlador = new TiendaController();

export class Menu {
    async getMenu() {
        console.clear();
        console.log(chalk.bold.magenta("================================================="));
        console.log(chalk.bold.magenta("    ⚙️      SISTEMA DE CONTROL DE INVENTARIO  ⚙️    "));
        console.log(chalk.bold.magenta("================================================="));
        
        const opcion = await inquirer.prompt([
            {
                type: 'select',
                name: 'accion',
                message: 'Seleccione la operación que desea realizar en el inventario:',
                choices: [
                    '1. Ver Inventario Completo (Stock Actual)', 
                    '2. Agregar Nueva Prenda al Inventario', 
                    '3. Cerrar Sistema'
                ]
            }
        ]);

        if (opcion.accion.includes('1')) {
            await this.VerInventario();
        } else if (opcion.accion.includes('2')) {
            await this.AgregarAlInventario();
        } else {
            console.log(chalk.yellow('\nCerrando el sistema de administración. ¡Nos vemos, mae! 👋\n'));
            process.exit();
        }
    }

    async VerInventario() {
        console.clear();
        console.log(chalk.bold.blue("========================================="));
        console.log(chalk.bold.blue("        📦 INVENTARIO EN BASE DE DATOS        "));
        console.log(chalk.bold.blue("=========================================\n"));
        
        const inventario = controlador.ObtenerCatalogo();

        if (inventario.length === 0) {
            console.log(chalk.bgRed.white(" ALERTA: El inventario está completamente vacío. Agregue prendas primero. \n"));
        } else {
            // Aquí se ejecuta el Polimorfismo imprimiendo el formato de la clase
            inventario.forEach(p => console.log(chalk.white(p.ObtenerDetalles())));
            console.log(chalk.green(`\nTotal de tipos de prendas registradas: ${inventario.length}\n`));
        }

        await inquirer.prompt([{ type: 'input', name: 'enter', message: 'Presione Enter para regresar al panel principal...' }]);
        await this.getMenu();
    }

    async AgregarAlInventario() {
        console.clear();
        console.log(chalk.bold.yellow("========================================="));
        console.log(chalk.bold.yellow("      ➕ Agregar Ropa Al Inventario (JSON)     "));
        console.log(chalk.bold.yellow("=========================================\n"));
        
        const datos = await inquirer.prompt([
            { type: 'input', name: 'id', message: 'Defina un ID único (Ej: ROP-01):' },
            { type: 'input', name: 'nombre', message: 'Nombre de la prenda (Ej: Pantalón Jean Slim):' },
            { type: 'number', name: 'precio', message: 'Precio unitario en dólares ($):' },
            { type: 'number', name: 'stock', message: 'Cantidad inicial que ingresa al almacén:' },
            { type: 'input', name: 'categoria', message: 'Categoría/Sección de la prenda (Ej: Camisas Caballeros):' }
        ]);

        // Validar que no dejen campos vacíos o números raros
        if (!datos.id || !datos.nombre || isNaN(datos.precio) || isNaN(datos.stock)) {
            console.log(chalk.red("\n❌ Error: Datos inválidos. No se guardó nada.\n"));
        } else {
            const nuevaPrenda = new RopaHombre(datos.id, datos.nombre, datos.precio, datos.stock, datos.categoria);
            
            // Enviamos el objeto al controlador para que lo guarde en el archivo *.json
            controlador.AgregarPrenda(nuevaPrenda);
            
            console.log(chalk.bgGreen.black("\n ✔️ ÉXITO: Prenda registrada y sincronizada en data/inventario.json 💾 \n"));
        }

        await inquirer.prompt([{ type: 'input', name: 'enter', message: 'Presione Enter para regresar...' }]);
        await this.getMenu();
    }
}