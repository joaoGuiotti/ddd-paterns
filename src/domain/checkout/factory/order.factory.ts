import Order from "../entity/order";
import OrderItem from "../entity/order-item";
import { v4 as uuid } from 'uuid';

type PropOrFactory<T> = T | ((index: number) => T);

export default class OrderFactory<TBuild = any> {
    private _id: PropOrFactory<string> = (i) => uuid();
    private _customerId: PropOrFactory<string> = (i) => `customer-${i + 1}`;
    private _items: PropOrFactory<OrderItem[]> = (i) => [
        new OrderItem(`item-${i + 1}`, `product-${i + 1}`, i + 1, (10 * (i + 1)).toString(), 1)
    ];

    private countObjs: number;

    static aOrder() {
        return new OrderFactory<Order>();
    }

    static theOrders(countObjs: number) {
        return new OrderFactory<Order[]>(countObjs);
    }

    private constructor(countObjs: number = 1) {
        this.countObjs = countObjs;
    }

    withId(valueOrFactory: PropOrFactory<string>) {
        this._id = valueOrFactory;
        return this;
    }

    withCustomerId(valueOrFactory: PropOrFactory<string>) {
        this._customerId = valueOrFactory;
        return this;
    }

    withItems(valueOrFactory: PropOrFactory<OrderItem[]>) {
        this._items = valueOrFactory;
        return this;
    }

    build(): TBuild {
        const orders = new Array(this.countObjs)
            .fill(undefined)
            .map((_, index) => {
                const id = this.callFactory(this._id, index);
                const customerId = this.callFactory(this._customerId, index);
                const items = this.callFactory(this._items, index);

                return new Order(id, customerId, items);
            });
        return this.countObjs === 1 ? (orders[0] as any) : orders as any;
    }

    private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
        return typeof factoryOrValue === 'function'
            ? factoryOrValue(index)
            : factoryOrValue;
    }
}