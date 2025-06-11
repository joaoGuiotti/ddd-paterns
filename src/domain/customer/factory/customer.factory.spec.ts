import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe('Customer Factory unit tests', () => {
    it('should create a customer', () => {
        const customer = CustomerFactory.aCustomer()
            .withName('Customer 1').build();

        expect(customer).toBeInstanceOf(Customer);
        expect(customer.isActive()).toBe(false);
        expect(customer.rewardPoints).toBe(0);
        expect(customer.address).toBeUndefined();
    });

    it('should create a list of customer', () => {
        const customers = CustomerFactory.theCustomers(3)
            .withName((i) => `Customer${i}`)
            .withRewardPoints((i) => i * 10)
            .withRandomAddress()
            .withActive((i) => i % 2 === 0)
            .build();

        expect(customers).toHaveLength(3);
        customers.forEach((customer: Customer, i: number) => {
            expect(customer).toBeInstanceOf(Customer);
            expect(customer.name).toBe(`Customer${i}`);
            expect(customer.rewardPoints).toBe(i * 10);
            expect(customer.address).toBeDefined();
            expect(customer.address).toBeInstanceOf(Address);
            expect(customer.isActive()).toBe(i % 2 === 0);
        });
    });


    it('should create a customer with reward points', () => {
        const customer = CustomerFactory.aCustomer()
            .withName('Customer 1')
            .withRandomAddress()
            .withRewardPoints(99)
            .activate().build();
        expect(customer).toBeInstanceOf(Customer);
        expect(customer.isActive()).toBe(true);
        expect(customer.rewardPoints).toBe(99);
        expect(customer.address).toBeDefined();
    });

    it('should create a customer active', () => {
        const customer = CustomerFactory.aCustomer()
            .withName('Customer 1').withRandomAddress()
            .activate().build();

        expect(customer).toBeInstanceOf(Customer);
        expect(customer.isActive()).toBe(true);
        expect(customer.rewardPoints).toBe(0);
        expect(customer.address).toBeDefined();
    });

    it('should create a customer with random Address', () => {
        const customer = CustomerFactory.aCustomer()
            .withName('Customer 1').withRandomAddress().build();

        expect(customer).toBeInstanceOf(Customer);
        expect(customer.isActive()).toBe(false);
        expect(customer.rewardPoints).toBe(0);
        expect(customer.address).toBeDefined();
        expect(customer.address).toBeInstanceOf(Address);
    });

});