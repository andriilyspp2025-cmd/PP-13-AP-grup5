# 📅 Rozklad - UniSchedule

> University Schedule Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)
![React 18](https://img.shields.io/badge/react-18.0+-blue.svg)

## Features

- 🔐 User registration with email verification
- 👥 Multi-role access (Admin, Teacher, Student/Parent)
- 📅 Smart schedule builder with conflict detection
- 🔄 Change management (cancellations, substitutions, rescheduling)
- 🔔 Real-time notifications
- 📱 Web + Mobile (React Native)

## Tech Stack

- **Backend**: FastAPI + PostgreSQL
- **Frontend**: React + TypeScript + Vite
- **Mobile**: React Native + Expo
- **Auth**: JWT + bcrypt

## Quick Start

### With Docker (Recommended)

```bash
# Windows
.\start.ps1

# Linux/Mac
chmod +x start.sh && ./start.sh
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs
- Default login: `admin` / `admin123`

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ENV_TEMPLATE.txt .env  # Configure database
alembic upgrade head
python create_admin.py
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
rozklad/
├── backend/       # FastAPI
├── frontend/      # React
├── mobile/        # React Native
└── docker-compose.yml
```

## Documentation

- 📖 [Setup Guide](SETUP.md)
- 🔧 [API Docs](API_DOCUMENTATION.md)
- ✨ [Features](FEATURES.md)
- 🤝 [Contributing](CONTRIBUTING.md)
- 🔒 [Security](SECURITY.md)

## Email Verification

**Development**: Links printed to console  
**Production**: Configure SMTP in `backend/.env`:

```bash
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_SERVER=smtp.gmail.com
```

## Security

⚠️ **Before production:**
- Change admin password
- Set strong `SECRET_KEY`
- Configure HTTPS/SSL
- Update `ALLOWED_ORIGINS`

See [SECURITY.md](SECURITY.md) for details.

## License

MIT © [Your Name]

## Support

- 🐛 [Report Issues](../../issues)
- 💬 [Discussions](../../discussions)
- 📧 Email: support@rozklad.com
