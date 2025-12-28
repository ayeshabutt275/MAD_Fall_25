# Food Delivery Backend API

Backend API for Food Delivery Application built with Express.js and MongoDB.

## Features

- User Authentication (Login/Signup)
- Food Items Management
- Order Management
- Image Serving

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables

3. Run the server:
```bash
npm run dev
```

## Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add environment variables:
     - `MONGO_URI`
     - `JWT_SECRET`
   
5. Update frontend URL in code:
   - Edit `api/index.js` and `server.js`
   - Replace `https://your-frontend-app.vercel.app` with your actual frontend Vercel URL

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login

### Foods
- `GET /api/foods` - Get all food items

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

### Health Check
- `GET /api/health` - Server health check

## Notes

- Images are served from `/images` directory
- MongoDB connection is cached for serverless environments
- CORS is configured to allow requests from frontend

