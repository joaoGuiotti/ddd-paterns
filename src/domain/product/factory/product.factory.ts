import Product from "../entity/product";
import ProductB from "../entity/product-b";
import IProduct from "../entity/product.interface";
import { v4 as uuid } from 'uuid';

type PropOrFactory<T> = T | ((index: number) => T);
type ProductType = 'A' | 'B';

export class ProductFactory<TBuild = any> {
  private _id: PropOrFactory<string> | undefined = undefined;
  private _name: PropOrFactory<string> = (_index) => `Product ${_index + 1}`;
  private _price: PropOrFactory<number> = (_index) => 1 + _index;
  private _productType: PropOrFactory<ProductType> = undefined;
  private countObjs: number;

  static aProduct() {
    return new ProductFactory<IProduct>().withType('A');
  }

  static aProductB() {
    return new ProductFactory<IProduct>().withType('B');
  }

  static theProducts(countObjs: number) {
    return new ProductFactory<IProduct[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
  }

  withType(type: ProductType) {
    this._productType = type;
    return this;
  }

  withId(valueOrFactory: PropOrFactory<string>) {
    this._id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withPrice(valueOrFactory: PropOrFactory<number>) {
    this._price = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const products = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        return this.callCreate(
          this._id ? this.callFactory(this._id, index) : uuid(),
          this._name ? this.callFactory(this._name, index) : this._name,
          this._price ? this.callFactory(this._price, index) : this._price
        );
      });
    return this.countObjs === 1 ? (products[0] as any) : products as any;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }

  private callCreate(id: string, name: string, price: number) {
    switch (this._productType) {
      case 'A':
        return new Product(id, name, price)
      case 'B':
        return new ProductB(id, name, price);
      default:
        throw new Error("Product type is not supported");
    }
  }
}