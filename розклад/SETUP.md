# Rozklad Setup Guide

This guide will help you set up the Rozklad scheduling system from scratch.

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Git
- Docker (optional, but recommended)

## Option 1: Docker Setup (Recommended)

The easiest way to get started is using Docker:

```bash
# Clone the repository
git clone <repository-url>
cd розклад

# Start all services
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8000
- Frontend on port 5173

Access the application:
- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs

## Option 2: Manual Setup

### 1. Database Setup

Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE rozklad;
CREATE USER rozklad_user WITH PASSWORD 'rozklad_pass';
GRANT ALL PRIVILEGES ON DATABASE rozklad TO rozklad_user;
\q
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Update DATABASE_URL and SECRET_KEY

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

The backend will be available at http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default API URL is http://localhost:8000)

# Start development server
npm run dev
```

The frontend will be available at http://localhost:5173

### 4. Mobile App Setup (Optional)

```bash
cd mobile

# Install dependencies
npm install

# Update API URL in src/services/api.ts

# Start Expo development server
npm start

# Follow Expo CLI instructions to run on iOS/Android
```

## Creating Your First User

### Option 1: Using the API

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "full_name": "System Administrator",
    "password": "admin123",
    "role": "super_admin",
    "institution_id": 1
  }'
```

### Option 2: Using Python Script

Create a file `create_admin.py`:

```python
from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()

# Create institution first
from app.models.institution import Institution
institution = Institution(
    name="Sample University",
    type="university",
    address="123 Main St",
    contact_email="contact@university.edu"
)
db.add(institution)
db.commit()

# Create admin user
admin = User(
    email="admin@example.com",
    username="admin",
    full_name="System Administrator",
    hashed_password=get_password_hash("admin123"),
    role="super_admin",
    is_active=True,
    institution_id=institution.id
)
db.add(admin)
db.commit()

print("Admin user created successfully!")
```

Run it:
```bash
cd backend
python create_admin.py
```

## Initial Data Setup

After creating your admin user, log in to the web interface and:

1. **Create Time Slots**
   - Go to Settings → Time Slots
   - Add your institution's time periods (e.g., "1st Period: 8:00-9:20")

2. **Add Groups/Classes**
   - Go to Groups
   - Add student groups (e.g., "10-A", "CS-101")

3. **Add Teachers**
   - Go to Teachers
   - Add teaching staff

4. **Add Classrooms**
   - Go to Classrooms
   - Add all available rooms

5. **Add Subjects**
   - Go to Schedule Builder → Subjects
   - Add subjects/courses

6. **Build Schedule**
   - Go to Schedule Builder
   - Create schedule entries for each class

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # Windows
   pg_isready -U postgres
   
   # macOS/Linux
   sudo systemctl status postgresql
   ```

2. Check your DATABASE_URL in `.env`

3. Ensure the user has proper permissions

### Port Already in Use

If ports 8000 or 5173 are already in use:

1. Change the port in the startup command:
   ```bash
   # Backend
   uvicorn app.main:app --port 8001
   
   # Frontend
   npm run dev -- --port 5174
   ```

2. Update the API URL in frontend `.env` accordingly

### Migration Issues

If database migrations fail:

```bash
cd backend

# Reset migrations (WARNING: This will delete all data)
alembic downgrade base
alembic upgrade head

# Or create a new migration
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Production Deployment

### Environment Variables

Set these in production:

```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=<generate-a-strong-random-key>
ALLOWED_ORIGINS=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

### Security Checklist

- [ ] Change all default passwords
- [ ] Generate a strong SECRET_KEY
- [ ] Enable HTTPS/SSL
- [ ] Set up proper CORS origins
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

### Deployment Options

1. **Traditional Server**
   - Use Nginx as reverse proxy
   - Run backend with Gunicorn + Uvicorn
   - Serve frontend as static files

2. **Cloud Platforms**
   - Backend: Heroku, AWS EC2, Google Cloud Run
   - Frontend: Vercel, Netlify, AWS S3 + CloudFront
   - Database: AWS RDS, Google Cloud SQL

3. **Docker**
   - Build production images
   - Use Docker Compose or Kubernetes

## Support

For issues and questions:
- GitHub Issues: <repository-url>/issues
- Documentation: <documentation-url>
- Email: support@rozklad.com

