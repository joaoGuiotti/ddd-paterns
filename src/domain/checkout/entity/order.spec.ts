import Order from "../entity/order";
import OrderItem from "../entity/order-item";

describe('Order Unit Test', () => {

    it('should throw error when id is empty', () => {
        expect(() => {
            new Order('', '123', [new OrderItem('1', 'item', 10, 'p1', 1)]);
        }).toThrow('Id is required');
    });

    it('should throw error when customerId is empty', () => {
        expect(() => {
            new Order('123', '', [new OrderItem('1', 'item', 10, 'p1', 1)]);
        }).toThrow('CustomerId is required');
    });

    it.each([
        { value: null, createOrder: () => new Order('123', '123', null as any) },
        { value: undefined, createOrder: () => new Order('123', '123', undefined as any) },
        { value: [], createOrder: () => new Order('123', '123', []) }
    ])('should throw error when items is empty: %s', ({ value, createOrder }) => {
        expect(() => createOrder()).toThrow('Items length must be greater than 0');
    });

    it('should create order with valid data', () => {
        const item1 = new OrderItem('1', 'item 1', 10, 'p1', 2);
        const item2 = new OrderItem('2', 'item 2', 20, 'p2', 1);
        const order = new Order('o1', 'c1', [item1, item2]);
        expect(order.id).toBe('o1');
        expect(order.customerId).toBe('c1');
        expect(order.items).toEqual([item1, item2]);
        expect(order.total()).toBe(40);
    });

    it('should calculate total correctly', () => {
        const item1 = new OrderItem('1', 'item 1', 15, 'p1', 2); // 30
        const item2 = new OrderItem('2', 'item 2', 5, 'p1', 3);  // 15
        const order = new Order('o2', 'c2', [item1, item2]);
        expect(order.total()).toBe(45);
    });

    it('should validate a valid order', () => {
        const item = new OrderItem('1', 'item', 10, 'p1', 1);
        const order = new Order('o3', 'c3', [item]);
        expect(order.validate()).toBe(true);
    });

});