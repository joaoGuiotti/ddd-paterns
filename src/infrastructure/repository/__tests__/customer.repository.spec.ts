import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from 'uuid';
import CustomerModel from "../../db/sequelize/model/customer.model";
import CustomerRepository from "../customer.repository";
import Customer from "../../../domain/entity/customer";
import Address from "../../../domain/entity/address";

describe('Customer repository tests', () => {
    let sequelize: Sequelize;
    let repository: CustomerRepository;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
        repository = new CustomerRepository();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a customer', async () => {
        const customerId = uuid();
        const customer = new Customer(customerId, 'c1');
        const address = new Address('St1', 1, 'zipcode1', 'city1');
        customer.changeAddress(address)

        await repository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: customerId } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customerId,
            name: customer.name,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        });
    });

    it('should update a customer', async () => {
        const customerId = uuid();
        const customer = new Customer(customerId, 'c1');
        const address = new Address('St1', 1, 'zipcode1', 'city1');
        customer.changeAddress(address)

        await repository.create(customer);

        customer.changeName('customer updated');
        await repository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: customerId } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customerId,
            name: 'customer updated',
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        });
    });

    it('should find a customer', async () => {
        const customerId = uuid();
        const customer = new Customer(customerId, 'c1');
        const address = new Address('St1', 1, 'zipcode1', 'city1');
        customer.changeAddress(address)

        await repository.create(customer);

        const foundCustomer = await repository.find(customer.id);

        expect(customer).toStrictEqual(foundCustomer);
    });

    it('shold thorw error when a customer is not found', async () => {
        expect(async () => {
            await repository.find('123');
        }).rejects.toThrow('Customer not found');
    });

    it('should find all products', async () => {
        const customer1 = new Customer(uuid(), 'c1');
        const address1 = new Address('St1', 1, 'zipcode1', 'city1');
        customer1.changeAddress(address1);
        await repository.create(customer1);

        const customer2 = new Customer(uuid(), 'c2');
        const address2 = new Address('St2', 2, 'zipcode2', 'city2');
        customer2.changeAddress(address2);
        await repository.create(customer2);

        const customers = [customer1, customer2];

        const models = await repository.findAll();

        expect(customers).toEqual(models);
    });

});