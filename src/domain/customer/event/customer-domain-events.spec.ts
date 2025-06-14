import EventDispatcher from "../../shared/event/event-dispatacher";
import IEventDispatcher from "../../shared/event/event-dispatcher.interfce";
import CustomerCreatedEvent from "../event/customer-created-event";
import EnviaConsoleLog1Handler from "../event/handler/handler1";
import EnviaConsoleLog2Handler from "../event/handler/handler2";

describe("Customer Domain Events", () => {
    let eventDispatcher: IEventDispatcher;

    beforeEach(() => {
        eventDispatcher = new EventDispatcher();
    });

    afterAll(() => {
        eventDispatcher.unregisterAll();
    });

    it("should call both handlers when CustomerCreatedEvent is triggered", () => {
        const event = new CustomerCreatedEvent({ id: "1", name: "John" });
        const handler1 = new EnviaConsoleLog1Handler();
        const handler2 = new EnviaConsoleLog2Handler();
        jest.spyOn(handler1, "handle");
        jest.spyOn(handler2, "handle");
        const spy = jest.spyOn(console, "log");

        eventDispatcher.register(CustomerCreatedEvent.name, handler1);
        eventDispatcher.register(CustomerCreatedEvent.name, handler2);

        eventDispatcher.notify(event);

        expect(handler1.handle).toHaveBeenCalled();
        expect(handler2.handle).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(`Esse é o primeiro console.log do evento: ${JSON.stringify(event)}`);
        expect(spy).toHaveBeenCalledWith(`Esse é o segundo console.log do evento: ${JSON.stringify(event)}`);
    });
});