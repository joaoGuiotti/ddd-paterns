import Address from "../value-object/address";
import Customer from "./customer";

describe('Customer Unit Entity', () => {
    it('should thow an error if id is empty', () => {
        expect(() => {
            new Customer('', 'John Doe');
        }).toThrow('Id is required');
    });

    it('should thow an error if name is empty', () => {
        expect(() => {
            new Customer('123', '');
        }).toThrow('Name is required');
    });

    it('should change name', () => {
        const customer = new Customer('123', 'John Doe');
        customer.changeName('Jane Doe');
        expect(customer.name).toBe('Jane Doe');
    });

    it('should activate customer', () => {
        const customer = new Customer('123', 'John Doe');
        customer.changeAddress(new Address('Street 1', 123, '13300-000', 'City'));
        customer.activate();
        expect(customer.name).toBe('John Doe');
        expect(customer.isActive()).toBe(true);
    });

    it('should thorw error when address is undefined when activate', () => {
        expect(() => {
            const customer = new Customer('123', 'John Doe');
            customer.activate();
        }).toThrow(
            'Address is required to activate a customer'
        );
    });

    it('should deactivate customer', () => {
        const customer = new Customer('123', 'John Doe');
        customer.changeAddress(new Address('Street 1', 123, '13300-000', 'City'));
        customer.activate();
        expect(customer.isActive()).toBe(true);
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    });

    it('should throw error when try add negatives points', () => {
        const customer = new Customer('123', 'John Doe');
        expect(() => {
            customer.addRewardPoints(-1);
        }).toThrow('Points must be greater than zero');
    });

    it('should add reward points', () => {
        const customer = new Customer('123', 'John Doe');
        expect(customer.rewardPoints).toBe(0);
        customer.changeAddress(new Address('Street 1', 123, '13300-000', 'City'));
        customer.activate();
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);
        
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});