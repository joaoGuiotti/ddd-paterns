import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from 'uuid';
import OrderRepository from "./order.repository";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order-item";
import Order from "../../../../domain/checkout/entity/order";

describe('Order repository tests', () => {
    let sequelize: Sequelize;
    let orderRepository: OrderRepository;
    let customerRepository: CustomerRepository;
    let productRepository: ProductRepository;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([OrderModel, OrderItemModel, ProductModel, CustomerModel]);
        await sequelize.sync();
        orderRepository = new OrderRepository();
        customerRepository = new CustomerRepository();
        productRepository = new ProductRepository();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new order', async () => {
        const customer = new Customer(uuid(), 'c1');
        const address = new Address('St1', 1, 'zipcode1', 'city1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const product = new Product(uuid(), 'P1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            uuid(),
            product.name,
            product.price,
            product.id,
            10,
        );

        const order = new Order(uuid(), customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id,
                }
            ],
        });
    });

    it('should find a order', async () => {
        const customer = new Customer(uuid(), 'c1');
        const address = new Address('St1', 1, 'zipcode1', 'city1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const product = new Product(uuid(), 'P1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            uuid(),
            product.name,
            product.price,
            product.id,
            10,
        );

        const order = new Order(uuid(), customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderFound = await orderRepository.find(order.id);

        expect(order).toEqual(orderFound);
    });

    it('should throw error when order not found', async () => {
        expect(async () => {
            await orderRepository.find(uuid());
        }).rejects.toThrow('Order not found');
    });

    it('should find all order', async () => {
        const customer1 = new Customer(uuid(), 'Customer 1');
        customer1.changeAddress(new Address('Street 1', 1, '11111-111', 'City 1'));
        await customerRepository.create(customer1);

        const customer2 = new Customer(uuid(), 'Customer 2');
        customer2.changeAddress(new Address('Street 2', 2, '22222-222', 'City 2'));
        await customerRepository.create(customer2);

        const product1 = new Product(uuid(), 'Product 1', 100);
        await productRepository.create(product1);

        const product2 = new Product(uuid(), 'Product 2', 200);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem(uuid(), product1.name, product1.price, product1.id, 2);
        const orderItem2 = new OrderItem(uuid(), product2.name, product2.price, product2.id, 1);

        const order1 = new Order(uuid(), customer1.id, [orderItem1]);
        const order2 = new Order(uuid(), customer2.id, [orderItem2]);

        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders.length).toBe(2);
        expect(orders).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: order1.id, customerId: customer1.id, items: order1.items }),
                expect.objectContaining({ id: order2.id, customerId: customer2.id, items: order2.items }),
            ])
        );
    });

    it('should update a order', async () => {
        const customer = new Customer(uuid(), 'Customer Test');
        customer.changeAddress(new Address('Rua Teste', 123, '12345-678', 'Cidade Teste'));
        await customerRepository.create(customer);

        const product1 = new Product(uuid(), 'Produto 1', 50);
        await productRepository.create(product1);

        const orderItem1 = new OrderItem(uuid(), product1.name, product1.price, product1.id, 2);
        const order = new Order(uuid(), customer.id, [orderItem1]);
        await orderRepository.create(order);

        const product2 = new Product(uuid(), 'Produto 2', 100);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem(uuid(), product2.name, product2.price, product2.id, 1);

        order.changeItems([orderItem2]);
        await orderRepository.update(order);

        const updatedOrder = await orderRepository.find(order.id);

        expect(updatedOrder.items.length).toBe(1);
        expect(updatedOrder.items[0].id).toBe(orderItem2.id);
        expect(updatedOrder.items[0].productId).toBe(product2.id);
        expect(updatedOrder.total()).toBe(orderItem2.price * orderItem2.quantity);
    });
});