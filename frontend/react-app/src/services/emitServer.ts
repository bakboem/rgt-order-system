// EventDispatcher.ts
type EventCallback = () => void;

const eventMap = new Map<string, EventCallback[]>();

export const subscribe = (eventName: string, callback: EventCallback) => {
  if (!eventMap.has(eventName)) {
    eventMap.set(eventName, []);
  }
  eventMap.get(eventName)!.push(callback);
};

export const unsubscribe = (eventName: string, callback: EventCallback) => {
  const callbacks = eventMap.get(eventName);
  if (callbacks) {
    eventMap.set(
      eventName,
      callbacks.filter((cb) => cb !== callback)
    );
  }
};

export const emit = (eventName: string) => {
  const callbacks = eventMap.get(eventName);
  if (callbacks) {
    callbacks.forEach((callback) => callback());
  }
};
