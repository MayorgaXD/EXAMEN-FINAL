import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer'; // Para el flujo interactivo de compra
import chalk from 'chalk';
import { RopaHombre } from '../class/RopaHombre.js'; // Ajustado a tu ruta de clases

const filePath = path.resolve('data/inventario.json');

export class TiendaController {
    constructor() {
        this.prendas = [];
        this.CargarDatos();
    }

    // 📦 Carga y Encapsulamiento de los objetos
    CargarDatos() {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify([]));
            }
            
            const dataRaw = fs.readFileSync(filePath, 'utf-8');
            const listaData = JSON.parse(dataRaw || '[]');

            // Encapsulamiento: Mapeamos el JSON plano para volver a instanciar objetos reales de la clase
            this.prendas = listaData.map(item => {
                return new RopaHombre(item.id, item.nombre, item.precio, item.stock, item.categoria || item.tipo);
            });
        } catch (error) {
            this.prendas = [];
        }
    }

    // Persistencia de datos en formato JSON estructurado
    GuardarDatos() {
        const datosFormateados = this.prendas.map(p => {
            return typeof p.toJSON === 'function' ? p.toJSON() : { ...p };
        });
        fs.writeFileSync(filePath, JSON.stringify(datosFormateados, null, 2));
    }

    ObtenerCatalogo() {
        return this.prendas;
    }

    AgregarPrenda(prenda) {
        this.prendas.push(prenda);
        this.GuardarDatos();
    }

    // 🛒 MÓDULO DE COMPRA CON CONTROL DE STOCK Y CANCELACIÓN
    async ProcesarCompraCliente() {
        console.clear();
        console.log(chalk.bgBlue.white.bold(" ════════ MÓDULO DE COMPRA INTERACTIVA ════════ \n"));

        if (this.prendas.length === 0) {
            console.log(chalk.yellow("No hay productos registrados en el inventario actualmente."));
            return;
        }

        // 1. CORREGIDO: Usamos los Getters p.nombre, p.precio y p.stock en vez de variables crudas
        const listaOpciones = this.prendas.map(p => ({
            name: `${p.nombre} - Precio: $${p.precio} (Stock: ${p.stock} pzas)`,
            value: p.id
        }));

        // Opción para salir del menú sin realizar compras
        listaOpciones.push({ name: chalk.red("← Cancelar y volver al menú principal"), value: null });

        const seleccion = await inquirer.prompt([
            {
                type: 'select', // Tipo 'select' compatible con tu versión de Inquirer
                name: 'prendaId',
                message: 'Seleccione el artículo que desea adquirir:',
                choices: listaOpciones
            }
        ]);

        if (seleccion.prendaId === null) {
            console.log(chalk.gray("\nOperación abortada."));
            return;
        }

        const prendaSeleccionada = this.prendas.find(p => p.id === seleccion.prendaId);

        // CORREGIDO: Validación de stock usando el Getter .stock
        if (prendaSeleccionada.stock <= 0) {
            console.log(chalk.bgRed.white("\n [Aviso] El artículo seleccionado no tiene unidades disponibles. "));
            return;
        }

        // 2. Selección de la cantidad controlando que NO se pase del stock real
        const respuestaCantidad = await inquirer.prompt([
            {
                type: 'input', 
                name: 'cantidad',
                message: `¿Qué cantidad desea comprar? (Disponible máximo: ${prendaSeleccionada.stock}):`,
                validate: (input) => {
                    const num = parseInt(input);
                    if (isNaN(num) || num <= 0) {
                        return "Por favor, ingrese un número entero mayor a cero.";
                    }
                    // CORREGIDO: Compara usando el Getter .stock
                    if (num > prendaSeleccionada.stock) {
                        return `Acción denegada. Solo puedes comprar un máximo de ${prendaSeleccionada.stock} unidades.`;
                    }
                    return true;
                }
            }
        ]);

        const cantidadFinal = parseInt(respuestaCantidad.cantidad);
        
        // CORREGIDO: El cálculo del monto se procesa utilizando el Getter .precio
        const montoTotal = prendaSeleccionada.precio * cantidadFinal;

        // 3. Resumen final del monto
        console.log(`\n============================================`);
        console.log(chalk.cyan(` Artículo:   `) + prendaSeleccionada.nombre);
        console.log(chalk.cyan(` Cantidad:   `) + cantidadFinal + " unidad(es)");
        console.log(chalk.green.bold(` MONTO TOTAL: $${montoTotal}`));
        console.log(`============================================\n`);

        const confirmacion = await inquirer.prompt([
            {
                type: 'confirm', 
                name: 'proceder',
                message: '¿Está de acuerdo con el monto total para confirmar la transacción?',
                default: true
            }
        ]);

        if (confirmacion.proceder) {
            // CORREGIDO: Descontamos las unidades usando el Setter .stock de forma segura
            prendaSeleccionada.stock = prendaSeleccionada.stock - cantidadFinal;
            this.GuardarDatos(); 
            console.log(chalk.bgGreen.black("\n ✔️ ¡Compra procesada con éxito! Inventario actualizado. "));
        } else {
            console.log(chalk.bgRed.white("\n Compra cancelada por el cliente. No se realizó ningún cargo. "));
        }
    }
}