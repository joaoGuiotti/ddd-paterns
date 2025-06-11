import Order from "../entity/order";
import OrderItem from "../entity/order-item";
import OrderFactory from "./order.factory";

describe('Order Factory unit tests', () => {

    it('should create an order with default values', () => {
        const order = OrderFactory.aOrder().build();
        expect(order).toBeInstanceOf(Order);
        expect(order.id).toBeDefined();
        expect(order.customerId).toContain('customer-');
        expect(order.items.length).toBeGreaterThan(0);
        expect(order.items[0]).toBeInstanceOf(OrderItem);
        expect(order.total()).toBe(order.items.reduce((acc, item) => acc + item.total(), 0));
    });

    it('should create an order with custom values', () => {
        const items = [
            new OrderItem('item-1', 'product-1', 50, 'P1', 2),
            new OrderItem('item-2', 'product-2', 30, 'P2', 1)
        ];
        const order = OrderFactory.aOrder()
            .withId('order-123')
            .withCustomerId('customer-xyz')
            .withItems(() => items)
            .build();

        expect(order.id).toBe('order-123');
        expect(order.customerId).toBe('customer-xyz');
        expect(order.items).toEqual(items);
        expect(order.total()).toBe(50 * 2 + 30 * 1);
    });

    it('should create a list of orders', () => {
        const orders = OrderFactory.theOrders(3)
            .withCustomerId(i => `customer-${i}`)
            .withItems(i => [
                new OrderItem(i.toString(), `Item-${i}`, 10 * (i + 1), `Item ${i}`, 1)
            ])
            .build();

        expect(Array.isArray(orders)).toBe(true);
        expect(orders).toHaveLength(3);
        orders.forEach((order, i) => {
            expect(order).toBeInstanceOf(Order);
            expect(order.customerId).toBe(`customer-${i}`);
            expect(order.items.length).toBe(1);
            expect(order.items[0].name).toBe(`Item-${i}`);
        });
    });

    it('should throw error if items is empty', () => {
        expect(() => {
            OrderFactory.aOrder()
                .withItems(() => [])
                .build();
        }).toThrow('Items length must be greater than 0');
    });

});