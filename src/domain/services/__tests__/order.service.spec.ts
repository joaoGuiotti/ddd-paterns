import Address from "../../entity/address";
import Customer from "../../entity/customer";
import Order from "../../entity/order";
import OrderItem from "../../entity/order-item";
import OrderService from "../order.service";

const createActivateCustomer = () => {
    const customer = new Customer('c1', 'customer 1');
    customer.changeAddress(new Address('any', 11, '1231', 'sad'));
    customer.activate();
    return customer;
}

describe('Order Service Unit Tests', () => {

    it('should place an order', () => {
        const customer = createActivateCustomer();
        const item1 = new OrderItem('i1', 'Item1', 10, 'p1', 1);

        const order: Order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

    it('should get total of all orders', () => {
        const item1 = new OrderItem('001', 'Item 1', 100, 'p1', 1); // total 100
        const item2 = new OrderItem('002', 'Item 2', 200, 'p2', 2); // total 400

        const order1 = new Order('order1', '001c', [item1]);
        const order2 = new Order('order2', '002c', [item2]);

        const total = OrderService.calculateTotal([order1, order2]);

        expect(total).toBe(500);
    });

});