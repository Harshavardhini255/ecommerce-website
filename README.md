# E-Commerce Platform

A full-stack e-commerce application built with Django REST Framework and React.

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart and checkout
- 👤 User authentication (login/register)
- 💳 Payment integration (Stripe)
- 📊 Admin panel for managing products
- 📦 Order management system
- 🔍 Product search and filtering
- ⭐ Product reviews and ratings

## Tech Stack

### Backend
- Python 3.11+
- Django 5.0
- Django REST Framework
- PostgreSQL
- Redis (for caching)
- Celery (for async tasks)

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Redux Toolkit (state management)

## Project Structure

```
e-commerce/
├── backend/              # Django backend
│   ├── config/          # Project settings
│   ├── apps/
│   │   ├── users/       # User authentication
│   │   ├── products/    # Product management
│   │   ├── cart/        # Shopping cart
│   │   ├── orders/      # Order management
│   │   └── payments/    # Payment processing
│   ├── manage.py
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   ├── package.json
│   └── public/
├── docker-compose.yml
└── .gitlab-ci.yml
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Redis

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### Docker Setup

```bash
docker-compose up --build
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
REDIS_URL=redis://localhost:6379/0
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## License

MIT
