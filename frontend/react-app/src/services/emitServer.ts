// EventDispatcher.ts
type EventCallback = () => void;

const eventMap = new Map<string, Array<(error?: any) => void>>();
let lastEmitTime = 0;
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

export const emit = (eventName: string,error?: any) => {
  const callbacks = eventMap.get(eventName);
  if (callbacks) {
    callbacks.forEach((callback) => callback(error));
  }
};


export const throttleEmit = (eventName: string, payload: any, delay: number = 3000) => {
  const now = Date.now();
  if (now - lastEmitTime > delay) {
    emit(eventName, payload);
    lastEmitTime = now;
  }
};