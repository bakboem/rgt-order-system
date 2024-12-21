import { WebSocketMessage } from "../models/models";

const handleOrderUpdate = (data: any) => {
    console.log(`handleOrderUpdate Message:`, data);
};

const handleMenuAdd = (data: any) => {
    console.log(`handleMenuAdd Message:`, data);
};

const handleWelcomeMessage = (data: any) => {
    console.log(`handleWelcomeMessage Message: ${data.message}`);
};

const handlePongMessage = (data: any) => {
    console.log(`handlePongMessage received:`, data);
};

const handleEchoMessage = (data: any) => {
    console.log(`handleEchoMessage received:`, data.received_data);
};
const handleOrderDelete = (data: any) => {
    console.log(`handleOrderDelete received:`, data.received_data);
};
const handleOrderAdd = (data: any) => {
    console.log(`handleOrderAdd received:`, data.received_data);
};
const handleMenuDelete = (data: any) => {
    console.log(`handleMenuDelete received:`, data.received_data);
};
const handleMenuUpdate = (data: any) => {
    console.log(`handleMenuUpdate received:`, data.received_data);
};
const messageHandlers: { [key: string]: (data: any) => void } = {
    
    menu_add: handleMenuAdd,
    menu_update: handleMenuUpdate,
    menu_delete: handleMenuDelete,

    order_add: handleOrderAdd,
    order_delete: handleOrderDelete,
    order_update: handleOrderUpdate,

    welcome: handleWelcomeMessage,
    pong: handlePongMessage,
    echo: handleEchoMessage,

};

export const handleMessage = (rawData: string) => {
    try {
     
        const message: WebSocketMessage = JSON.parse(rawData);
        console.log(message)
        console.log("Message type:", typeof message);
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
