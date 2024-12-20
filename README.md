#### This is a skill test question before an interview, from RGT company

### **Order Management System**
This is a comprehensive full-stack order management system built using **React** for the frontend and **FastAPI** for the backend. It provides role-based features for users and businesses, enabling real-time interactions via WebSocket and robust RESTful API services for seamless operation.

---

### **User Features**
- **Authentication**: Secure user login with **JWT-based authentication**.
- **Menu Browsing**: View menus and items offered by various businesses.
- **Order Placement**: Submit orders with specified quantities while ensuring stock availability.
- **Real-Time Updates**: Track order status in real time using WebSocket notifications.
- **Order Management**: Cancel orders that are in a pending state.

---

### **Business Features**
- **Authentication**: Secure business login using **JWT-based authentication**.
- **Order Dashboard**: View all incoming orders categorized by their statuses (e.g., pending, accepted, processing, completed).
- **Order Actions**: Accept and update order statuses with instant feedback.
- **WebSocket Notifications**: Receive real-time updates for new orders via WebSocket.
- **Inventory Management**: Manage menu items and their stock levels through a user-friendly interface.

---

### **Backend Features**
- **RESTful APIs**: Supports the following operations:
  - **User Authentication**: `/user_login` endpoint for JWT-based authentication.
  - **Business Authentication**: `/business_login` endpoint for JWT-based authentication.
  - **Order Management**: Endpoints for placing, updating, and canceling orders.
  - **Menu and Inventory**: Endpoints for managing menus and inventory.
  - **Order Retrieval**: Endpoints for retrieving orders based on user or business roles.
- **WebSocket Server**: Enables real-time, bidirectional communication for order updates and notifications.
- **Order Processing Automation**:
  - Simulates a kitchen system that processes up to two orders concurrently.
  - Fixed preparation time of 10 seconds per order.
  - Handles inventory checks to ensure no negative stock levels or invalid requests.

---

### **Database Design**
The backend uses a **PostgreSQL** database with the following schema:

#### **Users Table**
```json
{
  "id": "UUID",
  "username": "string",
  "hashed_password": "encrypted"
}
```

#### **Businesses Table**
```json
{
  "id": "UUID",
  "biz_name": "string",
  "hashed_password": "encrypted"
}
```

#### **Menus Table**
```json
{
  "id": "UUID",
  "name": "string",
  "image_url": "string",
  "price": "float",
  "stock_quantity": "int",
  "biz_id": "UUID"
}
```

#### **Orders Table**
```json
{
  "id": "UUID",
  "state": "string",
  "biz_id": "UUID",
  "menu_id": "UUID",
  "user_id": "UUID",
  "quantity": "int"
}
```

---

### **Real-Time System Features**
- **WebSocket Integration**: 
  - Users are notified of order status changes instantly.
  - Businesses receive real-time updates for new orders.
- **Concurrency**: Backend supports concurrent WebSocket connections and concurrent order processing for efficient operations.
- **Error Handling**: Ensures that invalid requests are rejected with meaningful error messages.

---

### **Technical Highlights**
- **Frontend**: Developed with **React** and uses **Material-UI** for responsive and intuitive UI components.
- **Backend**: Built with **FastAPI** to deliver high performance and scalability.
- **Database**: Uses **PostgreSQL** for reliable data storage.
- **Authentication**: JWT implementation for secure role-based access.
- **Real-Time Communication**: Powered by WebSocket for dynamic interactions.

--- 

This system offers a robust solution for managing orders, ensuring real-time efficiency and smooth operations for both users and businesses.
