import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer'; 
import chalk from 'chalk';
import { RopaHombre } from '../class/RopaHombre.js'; 
import { RopaMujer } from '../class/RopaMujer.js'; 

const filePath = path.resolve('data/inventario.json');

export class TiendaController {
    constructor() {
        this.prendas = [];
        this.CargarDatos();
    }

    // Carga y Encapsulamiento de los objetos
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

            this.prendas = listaData.map(item => {
                const especificacion = item.corte || item.categoria || item.tipo || 'General';

                if (item.tipo === 'RopaMujer') {
                    return new RopaMujer(item.id, item.nombre, item.precio, item.stock, especificacion);
                } else {
                    return new RopaHombre(item.id, item.nombre, item.precio, item.stock, especificacion);
                }
            });
        } catch (error) {
            this.prendas = [];
        }
    }

    // Persistencia de datos en formato JSON structured
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

    // MÓDULO DE COMPRA CON CONTROL DE STOCK Y CANCELACIÓN
    async ProcesarCompraCliente() {
        console.clear();
        console.log(chalk.bgBlue.white.bold(" ════════ MÓDULO DE COMPRA INTERACTIVA ════════ \n"));

        if (this.prendas.length === 0) {
            console.log(chalk.yellow("No hay productos registrados en el inventario actualmente."));
            return;
        }

        const listaOpciones = this.prendas.map(p => ({
            name: `${p.nombre} - Precio: $${p.precio} (Stock: ${p.stock} pzas)`,
            value: p.id
        }));

        listaOpciones.push({ name: chalk.red("← Cancelar y volver al menú principal"), value: null });

        const seleccion = await inquirer.prompt([
            {
                type: 'select', 
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

        if (prendaSeleccionada.stock <= 0) {
            console.log(chalk.bgRed.white("\n [Aviso] El artículo seleccionado no tiene unidades disponibles. "));
            return;
        }

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
                    if (num > prendaSeleccionada.stock) {
                        return `Acción denegada. Solo puedes comprar un máximo de ${prendaSeleccionada.stock} unidades.`;
                    }
                    return true;
                }
            }
        ]);

        const cantidadFinal = parseInt(respuestaCantidad.cantidad);
        const montoTotal = prendaSeleccionada.precio * cantidadFinal;

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
            prendaSeleccionada.stock = prendaSeleccionada.stock - cantidadFinal;
            this.GuardarDatos(); 
            console.log(chalk.bgGreen.black("\n ✔️ ¡Compra procesada con éxito! Inventario actualizado. "));
        } else {
            console.log(chalk.bgRed.white("\n Compra cancelada por el cliente. No se realizó ningún cargo. "));
        }
    }
}