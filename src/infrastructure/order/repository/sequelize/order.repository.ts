import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order-item";
import IOrderRepository from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository
    implements IOrderRepository {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            })),
        }, {
            include: [{ model: OrderItemModel }],
        })
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total(),
            },
            {
                where: { id: entity.id },
            },
        );
        
        await OrderItemModel.destroy({
            where: { order_id: entity.id },
        });

        for (const item of entity.items) {
            await OrderItemModel.create({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            });
        }
    }

    async find(id: string): Promise<Order> {
        let model;
        try {
            model = await OrderModel.findOne({
                where: { id },
                include: ['items'],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Order not found");
        }
        const orderItems = model.items.map((item) => new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
        ));
        const order = new Order(
            model.id,
            model.customer_id,
            orderItems,
        );
        return order;
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: ['items'] });
        return orderModels.map((model) => {
            const orderItems = model.items.map((item: any) => new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            ));
            return new Order(
                model.id,
                model.customer_id,
                orderItems
            );
        });
    }

}