export class Prenda {
    // Propiedades privadas 
    #id; 
    #nombre; 
    #precio; 
    #stock; 

    constructor(id, nombre, precio, stock) {
        this.#id = id;
        this.#nombre = nombre;
        this.#precio = precio;
        this.#stock = stock;
    }

    // Métodos Getters
    get id() { return this.#id; }
    get nombre() { return this.#nombre; }
    get precio() { return this.#precio; }
    get stock() { return this.#stock; }
    
    // Setter 
    set stock(nuevoStock) { this.#stock = nuevoStock; }

    // Método polimórfico 
    ObtenerDetalles() {
        return `[ID: ${this.#id}] ${this.#nombre} | Precio: $${this.#precio} | Disponibles: ${this.#stock}`;
    }

    
    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            precio: this.#precio,
            stock: this.#stock,
            tipo: this.constructor.name
        };
    }
}