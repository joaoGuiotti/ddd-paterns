import Product from "../entity/product";
import ProductB from "../entity/product-b";
import { ProductFactory } from "./product.factory";

describe('Product factory unit tests', () => {

    it('should create an product', () => {
        const product = ProductFactory.aProduct()
            .withName('product').withPrice(99).build();
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.price).toBe(99);
        expect(product.constructor.name).toBe(Product.name);
    });

    it('should create a list of products A', () => {
        const products = ProductFactory.theProducts(3)
            .withType('A')
            .withName((i) => `productA${i + 1}`)
            .withPrice((i) => 10 + i)
            .build();

        expect(Array.isArray(products)).toBe(true);
        expect(products).toHaveLength(3);
        products.forEach((product: any, i: number) => {
            expect(product.id).toBeDefined();
            expect(product.name).toBe(`productA${i + 1}`);
            expect(product.price).toBe((10 + i)); // ProductB price is multiplied by 2
            expect(product.constructor.name).toBe(Product.name);
        });
    });

    it('should create an product B', () => {
        const product = ProductFactory.aProductB()
            .withName('product').withPrice(99).build();
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.price).toBe(99 * 2); // ProdutoB preço é multiplado por 2
        expect(product.constructor.name).toBe(ProductB.name);
    });

    it('should create a list of products B', () => {
        const products = ProductFactory.theProducts(3)
            .withType('B')
            .withName((i) => `productB${i + 1}`)
            .withPrice((i) => 10 + i)
            .build();

        expect(Array.isArray(products)).toBe(true);
        expect(products).toHaveLength(3);
        products.forEach((product: any, i: number) => {
            expect(product.id).toBeDefined();
            expect(product.name).toBe(`productB${i + 1}`);
            expect(product.price).toBe((10 + i) * 2); // ProductB price is multiplied by 2
            expect(product.constructor.name).toBe(ProductB.name);
        });
    });

    it('should throw error when product type is not supported', () => {
        expect(() => ProductFactory.aProduct().withType('C' as any).build())
            .toThrow('Product type is not supported');
    });

});