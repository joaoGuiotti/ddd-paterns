import IEventHandler from "./event-handler.interface";
import IEvent from "./event.interface";

export default interface IEventDispatcher {
    getEventHandler(eventName: string): IEventHandler[];
    notify(event: IEvent): void;
    register(eventName: string, handler: IEventHandler): void;
    unregister(eventName: string): void;
    unregisterAll(): void;
}