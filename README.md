#### This is a skill test question before an interview, from RGT company


#  Order Management System
This is a full-stack order management system built with React for the frontend and FastAPI for the backend. The system supports both user and enterprise roles, enabling real-time order updates using WebSocket and providing essential RESTful API services.



## User Features
- User login with **JWT-based authentication**
- View the menu of food items from different enterprises.
- Place orders with a specified quantity and submit them to the backend.
- Real-time order tracking via **WebSocket**, with live updates on status
- Ability to cancel orders that have not yet been accepted.

## Enterprise Features
- Enterprise login with **JWT-based authentication**
- View all incoming orders and their statuses (e.g., pending, accepted, processing, completed).
- Accept and update order statuses with a single click.
- Real-time notifications for new orders through WebSocket subscriptions.
- Manage menus and inventory levels.
  
## Backend Features
- RESTful API implementation for core functionalities：
  - /user_login: User authentication
  - /enterprise_login: Enterprise authentication.
  - /order: Place a new order with validation.
  - /cancel_order: Cancel pending orders.
  - /get_orders: Retrieve orders for a specific enterprise.
  - /set-menu-and-instore: Update menus and inventory.
- WebSocket server for full-duplex real-time messaging.
- Simulated kitchen automation to process orders:
  - Concurrently process up to 2 orders at a time.
  - Fixed 10-second preparation time for each order.
  - The quantity cannot be negative or out of stock

## Data Management
The backend uses in-memory data storage with the following structures:
### Users Table:
```
{
  "u_id": "UUID",
  "u_name": "string",
  "u_password": "encrypted"
}
```
### Enterprise Table:
```
{
  "e_id": "UUID",
  "e_name": "string",
  "e_password": "encrypted"
}


```
### Menus Table:
```
{
  "m_id": "UUID",
  "m_name": "string",
  "m_img_url": "string",
  "m_price": "double",
  "m_instore": "int"
}


```
### Orders Table:
```
{
  "o_id": "UUID",
  "o_state": "string",
  "e_id": "UUID",
  "m_id": "UUID",
  "u_id": "UUID"
}
```
