
export default class OrderItem {
    private _id: string;
    private _productId: string;
    private _name: string;
    private _price: number;
    private _quantity: number;

    constructor(id: string, name: string, price: number, productId: string, quantity: number) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._productId = productId;
        this._quantity = quantity;
        this.validate();
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error('Id is required');
        }
        if (this._name.length === 0) {
            throw new Error('Name is required');
        }
        if (this._price <= 0) {
            throw new Error('Price must be greater than zero');
        }
        if (this._quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
    }

    get id(): string {
        return this._id;
    }

    get quantity(): number {
        return this._quantity;
    }

    get price(): number {
        return this._price;
    }

    get name(): string {
        return this._name;
    }

    get productId(): string {
        return this._productId;
    }

    total(): number {
        return this._price * this._quantity;
    }

    toJSON() {
        return {
            id: this._id,
            name: this._name,
            price: this._price,
            productId: this._productId,
            quantity: this._quantity,
        }
    }
}
