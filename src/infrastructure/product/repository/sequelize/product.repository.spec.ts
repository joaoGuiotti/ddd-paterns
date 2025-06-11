import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from 'uuid';
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";
import Product from "../../../../domain/product/entity/product";


describe('Product repository tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a product', async () => {
        const prodRepo = new ProductRepository();
        const prodID = uuid();
        const prod = new Product(prodID, 'p1', 10);
        await prodRepo.create(prod);

        const prodModel = await ProductModel.findOne({ where: { id: prodID } });
        expect(prodModel.toJSON()).toStrictEqual({
            id: prodID,
            name: 'p1',
            price: 10
        });
    });

    it('should update a product', async () => {
        const prodRepo = new ProductRepository();
        const prodID = uuid();
        const prod = new Product(prodID, 'p1', 10);
        await prodRepo.create(prod);

        prod.changeName('p1 updated');
        prod.changePrice(11);

        await prodRepo.update(prod);

        const prodModelUpdated = await ProductModel.findOne({ where: { id: prodID } });

        expect(prodModelUpdated.toJSON()).toStrictEqual({
            id: prodID,
            name: 'p1 updated',
            price: 11
        });
    });

    it('should find a product', async () => {
        const prodRepo = new ProductRepository();
        const prodID = uuid();
        const prod = new Product(prodID, 'p1', 10);

        await prodRepo.create(prod);

        const foundProd = await prodRepo.find(prod.id);

        expect(foundProd.toJSON()).toStrictEqual({
            id: prodID,
            name: 'p1',
            price: 10
        });
    });

    it('should find all products', async () => {
        const prodRepo = new ProductRepository();

        const prod1 = new Product('p1', 'p1', 10);
        await prodRepo.create(prod1);

        const prod2 = new Product('p2', 'p2', 10);
        await prodRepo.create(prod2);

        const foundProds = await prodRepo.findAll();
        const prods = [prod1, prod2];

        expect(prods).toEqual(foundProds);
    });

});