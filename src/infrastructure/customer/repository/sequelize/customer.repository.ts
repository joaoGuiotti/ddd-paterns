import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "./customer.model";
import ICustomerRepository from "../../../../domain/customer/repository/customer-repository.interface";

export default class CustomerRepository
    implements ICustomerRepository {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        }, {
            where: { id: entity.id }
        });
    }

    async find(id: string): Promise<Customer> {
        let model;
        try {
            model = await CustomerModel.findOne({
                where: { id },
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Customer not found");
        }

        const customer = new Customer(id, model.name);
        const address = new Address(
            model.street,
            model.number,
            model.zipcode,
            model.city
        );
        customer.changeAddress(address);
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const models = await CustomerModel.findAll();
        return models.map((m) => {
            let entity = new Customer(m.id, m.name);
            const address = new Address(
                m.street,
                m.number,
                m.zipcode,
                m.city,
            );
            entity.changeAddress(address);
            if (m.rewardPoints > 0) {
                entity.addRewardPoints(m.rewardPoints);
            }
            if (m.active) {
                entity.activate();
            }
            return entity;
        });
    }
}