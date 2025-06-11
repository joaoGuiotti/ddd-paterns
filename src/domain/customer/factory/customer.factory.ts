import Customer from "../entity/customer";
import Address from "../value-object/address";
import { v4 as uuid } from 'uuid';

type PropOrFactory<T> = T | ((index: number) => T);

export default class CustomerFactory<TBuild = any> {
    private _id: PropOrFactory<string> | undefined = undefined;
    private _name: PropOrFactory<string> = (index) => `Customer${index + 1}`;
    private _address: PropOrFactory<Address> = (index) => undefined
    private _active: PropOrFactory<boolean> | undefined = undefined;
    private _rewardPoints: PropOrFactory<number> = () => undefined;

    private countObjs: number;

    static aCustomer() {
        return new CustomerFactory<Customer>();
    }

    static theCustomers(countObjs: number) {
        return new CustomerFactory<Customer[]>(countObjs);
    }

    private constructor(countObjs: number = 1) {
        this.countObjs = countObjs;
    }

    withId(valueOrFactory: PropOrFactory<string>) {
        this._id = valueOrFactory;
        return this;
    }

    withName(valueOrFactory: PropOrFactory<string>) {
        this._name = valueOrFactory;
        return this;
    }

    withAddress(valueOrFactory: PropOrFactory<Address>) {
        this._address = valueOrFactory;
        return this;
    }

    withRandomAddress() {
        this._address = (index: number) => {
            const id = uuid();
            return new Address(
                `Street ${id}`,
                index + 1,
                `City${index + 1}`,
                `Zip${index + 1}`
            );
        };
        return this;
    }

    withActive(valueOrFactory: PropOrFactory<boolean>) {
        this._active = valueOrFactory;
        return this;
    }

    withRewardPoints(valueOrFactory: PropOrFactory<number>) {
        this._rewardPoints = valueOrFactory;
        return this;
    }

    activate() {
        this._active = true;
        return this;
    }

    build(): TBuild {
        const customers = new Array(this.countObjs)
            .fill(undefined)
            .map((_, index) => {
                const id = this._id ? this.callFactory(this._id, index) : uuid();
                const name = this.callFactory(this._name, index);
                const address = this.callFactory(this._address, index);
                const active = this._active ? this.callFactory(this._active, index) : false;
                const rewardPoints = this.callFactory(this._rewardPoints, index);

                const customer = new Customer(id, name);
                customer.changeAddress(address);
                active ? customer.activate() : customer.deactivate();
                if (rewardPoints) {
                    customer.addRewardPoints(rewardPoints);
                }
                return customer;
            });
        return this.countObjs === 1 ? (customers[0] as any) : customers as any;
    }

    private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
        return typeof factoryOrValue === 'function'
            ? factoryOrValue(index)
            : factoryOrValue;
    }
}