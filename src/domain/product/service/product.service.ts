import Product from "../entity/product";

export default class ProductService {

    static increasePrice(products: Product[], percentage: number): Product[] {
        products.forEach(product => {
            const calculatedPrice = (product.price * percentage) / 100 + product.price;
            product.changePrice(calculatedPrice);
        });
        return products;
    }

}