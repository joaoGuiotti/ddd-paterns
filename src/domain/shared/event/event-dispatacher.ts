import IEventDispatcher from "./event-dispatcher.interfce";
import IEventHandler from "./event-handler.interface";
import IEvent from "./event.interface";

export default class EventDispatcher
    implements IEventDispatcher {

    private _eventHandlers = new Map<string, IEventHandler[]>();

    getEventHandler(eventName: string) {
        return this._eventHandlers.get(eventName);
    }

    register(eventName: string, handler: IEventHandler): void {
        const handlers = this._eventHandlers.get(eventName) ?? []
        this._eventHandlers.set(eventName, [...handlers, handler]);
    }

    notify(event: IEvent): void {
        const eventName = event.constructor.name;
        if (this._eventHandlers.has(eventName)) {
            this.getEventHandler(eventName).forEach((eventHandler) => {
                eventHandler.handle(event);
            });
        }
    }

    unregister(eventName: string): void {
        if (this._eventHandlers.has(eventName)) {
            this._eventHandlers.delete(eventName);
        }
    }

    unregisterAll(): void {
        this._eventHandlers.clear();
    }
}