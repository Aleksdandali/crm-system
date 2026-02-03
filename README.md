# Advanced CRM System

A full-featured Customer Relationship Management system with React frontend and Node.js backend.

## Features

- Contact and Company Management
- Deal Pipeline with Kanban Board
- Task Management with Calendar
- Email Integration (SMTP/IMAP)
- Reports and Analytics Dashboard
- Role-Based Access Control
- 1C System Integration
- Shine Shop Website Integration

## Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- Redis for caching
- JWT Authentication
- Socket.io for real-time updates

**Frontend:**
- React 18 with TypeScript
- Redux Toolkit
- Material-UI (MUI)
- React Query
- Chart.js/Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:5000`

## Project Structure

```
crm-system/
├── backend/          # Node.js Express backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── models/      # Database models
│   │   ├── controllers/ # Route controllers
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── integrations/# External integrations
│   │   └── utils/       # Utility functions
│   └── package.json
│
└── frontend/         # React TypeScript frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── features/    # Feature modules
    │   ├── store/       # Redux store
    │   └── services/    # API services
    └── package.json
```

## License

MIT
