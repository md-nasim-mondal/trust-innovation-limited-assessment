# Transport Management Module

A comprehensive **Transport Management System** developed using **React.js**, **Node.js (Express)**, and **PostgreSQL** with **Prisma ORM**. This module allows administrators to manage vehicles, routes, pickup points, and student allocations while ensuring **automatic transport fee generation**.

This repository fulfills the requirements of the technical assignment, focusing on system design, backend-frontend integration, and real-world business logic.

## 🔗 Deployment

- **Live Application (Frontend)**: [https://trust-innovation-limited-assessment.vercel.app/](https://trust-innovation-limited-assessment.vercel.app/)
- **Backend API**: [https://trust-innovation-limited-server.vercel.app/](https://trust-innovation-limited-server.vercel.app/)

---

## 🏗 System Design & Database Schema

The database is designed to be modular and scalable, ensuring data integrity across the transport module.

### 1. **Core Transport Models**

- **`Vehicle`**: Stores vehicle details (Number, Driver, Helper, Contact).
- **`PickupPoint`**: Defines specific geographic locations for stops.
- **`TransportFeeMaster`**: Defines standard fee structures (e.g., Monthly Zone A Fee, Quarterly Bus Fee).
- **`Route`**: Represents a travel path (Start to End).
  - _Relationship_: One Route is linked to one `TransportFeeMaster` (defining the cost for that route).

### 2. **Mapping & Relations**

- **`RoutePickupPoint`**: Many-to-Many link between `Route` and `PickupPoint`.
  - Defines the **sequence order** of stops for a specific route.
- **`VehicleRouteAssignment`**: Links a `Vehicle` to a `Route`. Allows tracking which vehicle is active on which route.

### 3. **Student Integration (The Critical Path)**

- **`Student`**: Core student record.
- **`TransportAllocation`**: The link between a `Student`, their assigned `Route`, and `Vehicle`.
  - _Constraint_: A student can only have one active allocation at a time.
- **`StudentFeeAssignment`**: The financial record.
  - Automatically generated when a student is allocated to a route.

---

## ⚡ API Logic & Automatic Fee Generation Flow

The core requirement of **"Automatic Fee Generation"** is implemented with the following atomic transaction logic:

1.  **Allocation Request**:
    - Admin submits `Student ID`, `Route ID`, and `Vehicle ID`.

2.  **Validation Layer**:
    - Checks if the Student exists.
    - Checks if the Student is _already_ allocated (prevents double billing).
    - Checks if the Route has a valid `TransportFeeMaster` linked to it.

3.  **Transactional Execution** (ACID Compliance):
    - **Step A**: Create a `TransportAllocation` record, linking the student to the route/vehicle with `ACTIVE` status.
    - **Step B**: Fetch the `amount` and `description` from the Route's `TransportFeeMaster`.
    - **Step C**: **Immediately create** a `StudentFeeAssignment` record for the current month.
      - _Status_: `PENDING`
      - _Amount_: inherited from `TransportFeeMaster`.

This ensures that **no student is allocated without a corresponding billing record**, satisfying the business requirement for revenue assurance.

---

## 📝 Key Assumptions & Decisions

1.  **Fee Structure**: We assume fees are determined by the **Route** (e.g., Zone-based pricing). Therefore, `TransportFeeMaster` is linked to `Route`.
2.  **Billing Cycle**: The system assumes monthly billing. When a student is allocated, fees are generated for the _current calendar month_.
3.  **Active Status**: Deleting/Canceling a `TransportAllocation` stops _future_ fee generation but preserves historical fee records for audit purposes.
4.  **Masters-First Approach**: The UI enforces creating Vehicles, Pickup Points, and Fees before defining Routes, ensuring data consistency.

---

## 🛠 Tech Stack

- **Frontend**: React.js 19, TypeScript, Tailwind CSS v4, Lucide React (Icons), React Hot Toast (Notifications).
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (via Supabase), Prisma ORM.
- **Tooling**: Vite, ESLint, Prettier.

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js (v18+)
- PostgreSQL Database
- pnpm (recommended) or npm

### 2. Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file by copying the example:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your credentials:
     ```env
     NODE_ENV=development
     PORT=5000
     # Your PostgreSQL Connection String
     DATABASE_URL="postgresql://user:password@localhost:5432/transport_db?schema=public"
     # Same as DATABASE_URL for local development (needed for pooling in prod)
     DIRECT_URL="postgresql://user:password@localhost:5432/transport_db?schema=public"
     # URL of your frontend application
     FRONTEND_URL="http://localhost:5173"
     ```

4. Initialize Database:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the Server:
   ```bash
   pnpm dev
   ```
   The server will start at `http://localhost:5000`.

### 3. Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```
2. Install dependencies and start:
   ```bash
   pnpm install
   pnpm run dev
   ```
   The client will start at `http://localhost:5173`.
