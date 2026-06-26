import fs from 'fs';
import path from 'path';
import { RopaHombre } from '../class/RopaHombre.js';

const filePath = path.resolve('data/inventario.json');

export class TiendaController {
    constructor() {
        this.prendas = [];
        this.CargarDatos();
    }

    CargarDatos() {
        try {
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify([]));
            }
            
            const dataRaw = fs.readFileSync(filePath, 'utf-8');
            const listaData = JSON.parse(dataRaw || '[]');

            // Abstracción
            this.prendas = listaData.map(item => {
                return new RopaHombre(item.id, item.nombre, item.precio, item.stock, item.tipo);
            });
        } catch (error) {
            this.prendas = [];
        }
    }

    // Guarda los cambios en el archivo JSON (Persistencia de datos)
    GuardarDatos() {
        const datosFormateados = this.prendas.map(p => p.toJSON());
        fs.writeFileSync(filePath, JSON.stringify(datosFormateados, null, 2));
    }

    ObtenerCatalogo() {
        return this.prendas;
    }

    AgregarPrenda(prenda) {
        this.prendas.push(prenda);
        this.GuardarDatos();
    }

    VenderPrenda(id, cantidad) {
        const prenda = this.prendas.find(p => p.id === id);
        if (prenda && prenda.stock >= cantidad) {
            prenda.stock -= cantidad;
            this.GuardarDatos();
            return true; // Venta exitosa
        }
        return false; // No hay stock o no existe
    }
}