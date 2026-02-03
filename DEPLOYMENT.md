# CRM System Deployment Guide

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- PostgreSQL 14+ (for local development)
- Redis 6+ (for local development)

## Quick Start with Docker

### 1. Clone and Setup

```bash
cd crm-system
```

### 2. Configure Environment Variables

Backend configuration:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

Frontend configuration:
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env if needed (default values work with Docker)
```

### 3. Deploy

```bash
./deploy.sh
```

This will:
- Build all Docker images
- Start PostgreSQL, Redis, Backend, and Frontend
- Run database migrations
- Make the system available at http://localhost

### 4. Access the System

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/health

## Development Setup

### Option 1: Docker for Services Only

Start only PostgreSQL and Redis with Docker:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Run backend locally:
```bash
cd backend
npm install
cp .env.example .env
# Configure .env with localhost database
npm run migrate
npm run dev
```

Run frontend locally:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Option 2: Full Local Development

Install PostgreSQL and Redis locally, then:

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configure .env
npm run migrate
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## Production Deployment

### Environment Configuration

#### Backend Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=crm_database
DB_USER=postgres
DB_PASSWORD=<strong-password>

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>

# JWT
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-another-strong-secret>
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS
CORS_ORIGIN=https://your-domain.com

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Integrations
ONEC_API_URL=http://your-1c-server/api
ONEC_API_KEY=your-1c-api-key
SHINE_SHOP_API_URL=https://shine-shop.com.ua/api
SHINE_SHOP_API_KEY=your-shine-shop-api-key
```

#### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update to your domain:
```env
VITE_API_URL=https://api.your-domain.com/api
```

### SSL/HTTPS Setup

For production, use nginx or a reverse proxy with Let's Encrypt:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Database Backup

Create automated backups:

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres crm_database > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres crm_database < backup.sql
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build

# Remove all data (WARNING: destroys database)
docker-compose down -v
```

## Database Migrations

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Rollback last migration
docker-compose exec backend npm run migrate:undo

# Create new migration
docker-compose exec backend npx sequelize-cli migration:generate --name migration-name
```

## Monitoring

### Health Checks

- Backend health: http://localhost:5000/health
- Check logs: `docker-compose logs -f backend`

### Database Connection

```bash
docker-compose exec postgres psql -U postgres crm_database
```

### Redis Connection

```bash
docker-compose exec redis redis-cli
```

## Troubleshooting

### Port Already in Use

If ports 80, 5000, 5432, or 6379 are already in use:

1. Stop the conflicting service
2. Or modify ports in docker-compose.yml

### Database Connection Failed

1. Check if PostgreSQL is running: `docker-compose ps`
2. Verify credentials in .env file
3. Check logs: `docker-compose logs postgres`

### Frontend Can't Connect to Backend

1. Verify VITE_API_URL in frontend/.env
2. Check CORS_ORIGIN in backend/.env
3. Ensure backend is running: `docker-compose logs backend`

## Scaling

### Horizontal Scaling

To scale backend instances:

```bash
docker-compose up -d --scale backend=3
```

Add a load balancer (nginx) in front of backend instances.

### Database Optimization

For production:
- Enable connection pooling
- Configure PostgreSQL performance parameters
- Set up read replicas for reporting
- Regular vacuum and analyze

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitor logs for suspicious activity
- [ ] Rate limiting configured
- [ ] Database access restricted

## Support

For issues and questions:
- Check logs: `docker-compose logs -f`
- Review configuration files
- Verify environment variables
- Check database connectivity
