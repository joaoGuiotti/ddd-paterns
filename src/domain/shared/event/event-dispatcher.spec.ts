import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "../../shared/event/event-dispatacher";
import IEventDispatcher from "../../shared/event/event-dispatcher.interfce";

describe('Event Dispatcher tests', () => {
    let eventDispatcher: IEventDispatcher;

    beforeEach(() => {
        eventDispatcher = new EventDispatcher();
    });

    afterAll(() => {
        eventDispatcher.unregisterAll();
    });

    it('Should register an event handler', () => {
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const eventName = eventHandler.constructor.name;

        eventDispatcher.register(eventName, eventHandler);

        expect(eventDispatcher.getEventHandler(eventName))
            .toBeDefined();
        expect(eventDispatcher.getEventHandler(eventName))
            .toHaveLength(1);
        expect(eventDispatcher.getEventHandler(eventName)[0])
            .toMatchObject(eventHandler);
    });

    it('should unregister an event handler', () => {
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const eventName = eventHandler.constructor.name;

        eventDispatcher.register(eventName, eventHandler);

        expect(eventDispatcher.getEventHandler(eventName))
            .toHaveLength(1);

        eventDispatcher.unregister(eventName);

        expect(eventDispatcher.getEventHandler(eventName))
            .toBeUndefined();
    });

    it('should unregister all events', () => {
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const eventName = eventHandler.constructor.name;

        eventDispatcher.register(eventName, eventHandler);

        expect(eventDispatcher.getEventHandler(eventName))
            .toHaveLength(1);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandler(eventName))
            .toBeUndefined();
    });

    it('should notify all event handlers', () => {
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');
        eventDispatcher.register(ProductCreatedEvent.name, eventHandler);

        expect(eventDispatcher.getEventHandler(ProductCreatedEvent.name)[0])
            .toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: 'Prod 1',
            description: 'Prod 1 description',
            price: 10,
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

});