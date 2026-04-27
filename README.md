# Vue.js Project

A full-stack application with NestJS backend and Vue.js frontend.

## Backend

The backend is built with NestJS and includes:
- Authentication system
- Books management
- Authors management
- Favorites system
- Tasks management

### Setup

1. Navigate to the Backend directory
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Start the development server: `npm run start:dev`

### Docker

Run with Docker:
```bash
cd Backend
docker-compose up
```

## API Testing

Use the Bruno collection in `Backend/libratest/` for API testing.