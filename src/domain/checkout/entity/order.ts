import OrderItem from "./order-item";

export default class Order {
    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    public get id(): string {
        return this._id;
    }

    public get items(): OrderItem[] {
        return this._items ?? [];
    }

    public get customerId(): string {
        return this._customerId;
    }

    public total(): number {
        return this.items?.reduce((acc, item) => acc + item.total(), 0);
    }

    changeItems(items: OrderItem[]): void {
        this._items = items;
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error('Id is required');
        }
        if (this._customerId.length === 0) {
            throw new Error('CustomerId is required');
        }
        if (this.items && this.items?.length === 0) {
            throw new Error('Items length must be greater than 0');
        }
        return true;
    }

    toJSON() {
        return {
            id: this._id,
            customerId: this._customerId,
            items: this._items,
            total: this._total,
        }
    }
}