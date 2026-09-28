# Authentication & Product CRUD APIs

A complete implementation of the Sheryians Coding School assignment:

- Node.js + Express backend
- MongoDB + Mongoose
- JWT access + refresh tokens
- bcrypt password hashing
- Refresh-token persistence and revocation
- httpOnly refresh-token cookie
- Protected product write routes
- express-validator field-level 400 errors
- React frontend
- README + single repository structure

## 1. Project structure

```text
auth-product-crud-assignment/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/tokens.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 2. Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sheryians_assignment
CLIENT_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=your_long_access_secret
REFRESH_TOKEN_SECRET=your_different_long_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
```

## 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env` if required:

```env
VITE_API_URL=http://localhost:5000/api
```

Start:

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## 4. API endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh-token` | Refresh cookie |
| POST | `/api/auth/logout` | Access token |
| GET | `/api/auth/me` | Access token |
| POST | `/api/products` | Access token |
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| PUT | `/api/products/:id` | Access token |
| DELETE | `/api/products/:id` | Access token |

## 5. Authentication flow

1. Register creates a user after validating input and hashing the password with bcrypt.
2. Login checks the password with `bcrypt.compare`.
3. Login returns a short-lived access token in JSON.
4. Login also creates a long-lived refresh token and puts it in an httpOnly cookie.
5. Only a SHA-256 hash of the refresh token is stored in MongoDB.
6. Protected requests send `Authorization: Bearer <accessToken>`.
7. When the access token expires, the frontend calls `/auth/refresh-token`.
8. The backend verifies the refresh JWT and compares its hash with the stored hash.
9. A new access token and a rotated refresh token are issued.
10. Logout clears the server-side refresh token hash and the cookie.

## 6. Security decisions

- Passwords are never stored in plaintext.
- Passwords are never returned by API responses.
- Access and refresh JWTs use different secrets.
- Refresh tokens are stored server-side as hashes so logout/revocation is possible.
- Refresh tokens are httpOnly, preventing JavaScript from directly reading the cookie.
- Login has a basic rate limiter.
- Helmet adds common HTTP security headers.
- CORS only allows the configured frontend origin.
- Product IDs are validated before database queries.
- Write routes require authentication.
- Invalid request data gets HTTP 400 with field-level messages.

## 7. Product fields

A product contains:

```json
{
  "name": "Wireless Headphones",
  "description": "Bluetooth over-ear headphones",
  "price": 2499,
  "stock": 25,
  "category": "Electronics",
  "imageUrl": "https://example.com/headphones.jpg"
}
```

`name`, `description`, `price`, `stock`, and `category` are required.

## 8. Testing examples

Register:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Sam",
  "email": "sam@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "sam@example.com",
  "password": "password123"
}
```

Create product:

```http
POST /api/products
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Laptop",
  "description": "A development laptop",
  "price": 99999,
  "stock": 10,
  "category": "Computers",
  "imageUrl": ""
}
```

Get products:

```http
GET /api/products
```

Update:

```http
PUT /api/products/PRODUCT_ID
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

Delete:

```http
DELETE /api/products/PRODUCT_ID
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 9. Assignment coverage checklist

- [x] Register
- [x] Login
- [x] Access token
- [x] Refresh token
- [x] Refresh-token persistence/revocation
- [x] httpOnly refresh cookie
- [x] Logout
- [x] `/me`
- [x] Product create
- [x] Product list
- [x] Product by ID
- [x] Product update
- [x] Product delete
- [x] Protected write routes
- [x] express-validator on accepted input
- [x] Field-level validation errors
- [x] React register/login pages
- [x] Product listing
- [x] Add/edit/delete UI
- [x] README
- [x] Backend + frontend in one repository

## 10. Important deployment note

For production deployment, use HTTPS and set:

```env
NODE_ENV=production
```

The refresh cookie is then configured as secure and cross-site compatible for a separately hosted frontend/backend.

You must provide the final GitHub repository URL and live project URL when submitting. This generated project contains the complete source but cannot create those external URLs by itself.
