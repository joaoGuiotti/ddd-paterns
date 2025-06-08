import Product from "../../entity/product";
import ProductService from "../product.service";

describe('Product Service unit tests', () => {
    it('should change the prices of all products', () => {
        const prod1 = new Product('001', 'prod1', 10);
        const prod2 = new Product('002', 'Prod2', 20);
        const products = [prod1, prod2];
        ProductService.increasePrice(products, 100);
        expect(prod1.price).toBe(20);
        expect(prod2.price).toBe(40);
    });
});