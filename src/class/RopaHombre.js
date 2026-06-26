import { Prenda } from './Prenda.js';

export class RopaHombre extends Prenda {
    constructor(id, nombre, precio, stock, categoria) {
        super(id, nombre, precio, stock);
        this.categoria = categoria; 
    }

    ObtenerDetalles() {
        return `${super.ObtenerDetalles()} | Sección: ${this.categoria}`;
    }
}
