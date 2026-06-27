import { Prenda } from './Prenda.js'; 

export class RopaMujer extends Prenda {
    #tallaDamas;

    constructor(id, nombre, precio, stock, tallaDamas) {
        super(id, nombre, precio, stock);
        this.#tallaDamas = tallaDamas;
    }

    ObtenerDetalles() {
        return `[ID: ${this.id}] ${this.nombre} | Precio: $${this.precio} | Disponibles: ${this.stock} | Sección: RopaMujer (Talla: ${this.#tallaDamas})`;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            precio: this.precio,
            stock: this.stock,
            corte: this.#tallaDamas,
            tipo: 'RopaMujer' 
        };
    }
}