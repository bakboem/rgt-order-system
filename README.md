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
  

### Account Information
- **User Accounts:** ID and password are the same for each account:
  - `rgt1` and `rgt2`
- **Business Accounts:** ID and password are the same for each account:
  - `biz1` and `biz2`

### Frontend Overview

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

### Backend Overview

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
export CURRENT_PATH=$PWD
```

#### Start PostgreSQL and RabbitMQ
```bash
docker-compose -f ./docker-compose-dev.yml up --build -d
```

#### Backend
```bash

cd backend
poetry install --no-root
poetry shell
```

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd $CURRENT_PATH/frontend/react-app
yarn install
```
```
yarn start
```
#### HAPPY HACKING!~