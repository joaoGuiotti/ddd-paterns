import IRepository from "../../shared/repository/repository-interface";
import Customer from "../entity/customer";

export default interface ICustomerRepository
    extends IRepository<Customer> { }