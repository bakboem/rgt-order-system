# RGT Order System

This repository is a skill assessment project for a pre-interview evaluation with RGT Company in Korea.


## The project took 4 Day.

## Video Demonstration
[YouTube Video](https://youtu.be/tzzhALrxtS4)

---

## Project Details

### Stack
- **React Typscript**
- **Python FastApi**
- **Dokcer**
- **PostgreSQL**
- **RabbitMQ**
- **WebSocket**
- **RESTful API**
  
## Features
- ### ***Real-Time WebSocket Communication***
  - Supports bi-directional WebSocket communication for user and business updates.
  - Efficient handling of multiple active connections with user and business segregation.
- ### ***Heartbeat Monitoring***
  - Server performs passive heartbeat checks every 30 seconds.
  - Clients proactively initiate heartbeat checks if no server heartbeat is received within 30 seconds.
  - Automatically disconnects inactive WebSocket connections.
- ### ***Connection Monitoring***
  - Periodically monitors active connections
  - Dynamically adjusts monitoring intervals based on the number of active connections.
  - Detects and handles inactive connections by disconnecting them
- ### ***Redis Message Queue***
  - Stores failed messages in Redis for later retry.
  - Implements a retry mechanism with a configurable maximum retry count.
  - Supports dead-letter queue for messages that exceed retry limits
- ### ***Order Update Broadcasting***
  - Broadcasts order updates to specific users or businesses via WebSocket
  - Handles user-specific and business-specific message routing
  - Saves failed messages for retry in case of connection issues


### ***Account Information***
- **User Accounts:** ID and password are the same for each account:
  - `rgt1` and `rgt2`
- **Business Accounts:** ID and password are the same for each account:
  - `biz1` and `biz2`

### ***Frontend Overview***

#### User Roles
- **`user`**: General account users.
- **`bizUser`**: Business account users.

#### Login Behavior
- Separate JWT session management for `user` and `bizUser`.
- After JWT expiration, any API request redirects to the login page.

#### Account Switching
- Click the `Change` button in the top-right corner to switch to the login selection screen.

#### Main Page
- Located at `src/pages/EntryPage.tsx`.

#### WebSocket Communication
- **Socket Message Format:**
  ```json
  {
    "type": string,
    "data": [object]
  }
  ```
- **Supported Message Types:**
  - `order_update`


- **Socket Callbacks:**
  - Register type-specific callbacks directly on the page.
  - Multiple callbacks can be registered.
  - Use callbacks for state management.

- **Socket Buffering Layer:**
  - Introduced a producer-consumer business module for buffering to handle concurrent operations effectively.

---

### ***Backend Overview***

#### JWT
- JWT expiration time is 15 minutes.
- JWT renewal logic is not included.

#### WebSocket
- Implemented a **Socket Pool** to reuse socket resources.
- Incorporated **Rabbit Task** for enhanced concurrency:
  - Designed with extensible and parallelizable multi-consumer architecture.

#### Database
- Chose PostgreSQL Driver for robust asynchronous operations.

---

### Infrastructure Details
- Due to time constraints, CI/CD was not extended to infrastructure.
- Automated resource management and deployment logic included via Terraform (AWS-based).

---

## Environment Setup
- Node 22+
### Prerequisites
- Install **Docker** and **Node.js**.
- Install Poetry:
  ```bash
  pip install poetry
  ```

### Running the Project

#### Clone the Repository
```bash
git clone https://github.com/bakboem/rgt-order-system.git
cd rgt-order-system
```

#### Start PostgreSQL and RabbitMQ
```bash
docker-compose -f ./docker-compose-dev.yml up --build -d
```

#### Backend 
- open a shell 
```bash
cd backend
poetry install --no-root
poetry shell
```

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
- open a shell
```bash
cd rgt-order-system/frontend/react-app
yarn install
```
```
yarn start
```
#### HAPPY HACKING!~