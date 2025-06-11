import Product from "./product";

describe('Product unit tests', () => {

    it('Should throw error when id is empty', () => {
        expect(() => {
            const product = new Product('', 'Product 1', 100.20);
        }).toThrow('Id is required');
    });

    it('should throw error when name is empty', () => {
        expect(() => {
            const prod = new Product('12', '', 100);
        }).toThrow('Name is required');
    });

    it('should throw error when price  is less than zero', () => {
        expect(() => {
            const prod = new Product('12', 'Prod 1', -1);
        }).toThrow('Price must be greater than zero');
    });

    it('should change name', () => {
        const prod = new Product('12', 'Prod 1', 1);
        prod.changeName('Prod 2');
        expect(prod.name).toBe('Prod 2');
    });
    it('should change price', () => {
        const prod = new Product('12', 'Prod 1', 1);
        prod.changePrice(99.99);
        expect(prod.price).toBe(99.99);
    });
})