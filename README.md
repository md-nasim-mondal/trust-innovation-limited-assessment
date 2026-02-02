# Transport Management Module

A comprehensive Transport Management System developed using React.js, Node.js, Express, and PostgreSQL with Prisma ORM. This module allows administrators to manage vehicles, routes, pickup points, and student allocations while ensuring automatic transport fee generation.

## 🚀 Features

- **Masters Management**:
  - **Vehicles**: Manage fleet details including driver and helper info.
  - **Pickup Points**: Manage stop locations.
  - **Fees Master**: Define fee structures (e.g., Monthly/Quarterly).
- **Route Operations**:
  - **Routes**: Create routes with start/end points.
  - **Stops**: Map multiple pickup points to routes in sequence.
  - **Vehicle Assignment**: Assign vehicles to specific routes.
- **Student Operations**:
  - **Student Management**: Create and list students.
  - **Allocation**: Assign students to routes and vehicles.
  - **Auto-Fee Generation**: Automatically generates a fee record for the student upon allocation.
  - **Fee Management**: Track and update fee status (Paid/Pending).

## 🛠 Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL, Prisma ORM.

## 📦 Project Structure

This project follows a monorepo-style structure:

- `client/`: React Frontend Application.
- `server/`: Node.js/Express Backend Application.

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database
- pnpm (recommended) or npm

### 1. Database Setup

Ensure you have a PostgreSQL database running. Update the connection string in `server/.env`.

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env and set DATABASE_URL="postgresql://user:password@localhost:5432/transport_db?schema=public"

pnpm install
npx prisma migrate dev --name init
pnpm dev
```

The server will start at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd client
pnpm install
pnpm run dev
```

The client will start at `http://localhost:5173`.

## 🔄 API Logic & Auto-Fee Flow

1.  **Define Masters**: Admin sets up Vehicles, Pickup Points, and Fee Structures.
2.  **Create Route**: Admin creates a route, selects a Fee Structure, and adds Pickup Points as intermediate stops.
3.  **Assign Vehicle**: A vehicle is assigned to the created Route.
4.  **Allocate Student (Critical)**:
    - Admin selects a Student, Route, and Vehicle.
    - **Backend Logic**:
      - Validates the request.
      - Creates a `TransportAllocation` record.
      - Fetches the `TransportFeeMaster` associated with the Route.
      - **Auto-Generation**: Immediately creates a `StudentFeeAssignment` record for the _current month_ with `PENDING` status.

## 📝 Assumptions

- A student uses the transport for the entire month if allocated at any time during that month.
- Routes have a single "Fee Structure" (e.g., Zone A fee) applied to all students on that route.
- Vehicle assignment is 1:1 active per route at a time (simplified for this module).
