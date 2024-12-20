import { WebSocketMessage } from "../models/models";

const handleOrderUpdate = (data: any) => {
    console.log(`Order Update:`, data);
};

const handleMenuAdd = (data: any) => {
    console.log(`Menu Added:`, data);
};

const handleWelcomeMessage = (data: any) => {
    console.log(`Welcome Message: ${data.message}`);
};

const handlePongMessage = (data: any) => {
    console.log(`Pong received:`, data);
};

const handleEchoMessage = (data: any) => {
    console.log(`Echo received:`, data.received_data);
};

const messageHandlers: { [key: string]: (data: any) => void } = {
    order_update: handleOrderUpdate,
    menu_add: handleMenuAdd,
    welcome: handleWelcomeMessage,
    pong: handlePongMessage,
    echo: handleEchoMessage,
};

export const handleMessage = (rawData: string) => {
    try {
        const message: WebSocketMessage = JSON.parse(rawData);

        if (!message.type) {
            throw new Error("Message lacks required 'type' field.");
        }

        const handler = messageHandlers[message.type];
        if (handler) {
            handler(message.data);
        } else {
            console.warn("Unknown message type:", message.type);
        }
    } catch (error) {
        console.error("Failed to process message:", error, "Raw data:", rawData);
    }
};

export default handleMessage;
