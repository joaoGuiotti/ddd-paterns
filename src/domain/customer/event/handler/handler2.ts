import IEventHandler from "../../../shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created-event";

export default class EnviaConsoleLog2Handler implements IEventHandler<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent): void {
        console.log(`Esse é o segundo console.log do evento: ${JSON.stringify(event)}`);
    }
}