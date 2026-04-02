# Fullstack Project Complete Setup Guide

## ✅ Changes Applied

### 1. **Frontend Configuration (React + Vite)**
- ✅ `vite.config.js` updated to run on **port 5176**
- ✅ Frontend API configuration (`src/services/api.js`) set to connect to `http://localhost:8080/api`

### 2. **Backend Configuration (Spring Boot Java)**
- ✅ `application.properties` configured to run on **port 8080**
- ✅ Database: MySQL on **port 3306** (nutrifit_db)
- ✅ All Controllers updated with `@CrossOrigin(origins = "http://localhost:5176")`

### 3. **CORS Configuration Applied to:**
- ✅ AuthController
- ✅ UserController
- ✅ FoodController
- ✅ AdminController
- ✅ DoctorController
- ✅ MealController
- ✅ ChatController
- ✅ HealthController

---

## 🚀 How to Run the Complete Fullstack Project

### **Step 1: Prepare the Database**

Ensure MySQL is running and create the database:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS nutrifit_db;

-- Or if you want a fresh database
DROP DATABASE IF EXISTS nutrifit_db;
CREATE DATABASE nutrifit_db;
```

### **Step 2: Start the Backend (Port 8080)**

Open a terminal and navigate to the backend directory:

```bash
cd backend

# If using Maven to run Spring Boot
mvn clean install
mvn spring-boot:run
```

Or if you have a JAR file:
```bash
java -jar target/nutrifit-backend-1.0.0.jar
```

**Expected Output:**
```
Backend running on http://localhost:8080
```

### **Step 3: Start the Frontend (Port 5176)**

Open a new terminal and navigate to the root project directory:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

**Expected Output:**
```
  VITE v... dev server running at:
  ➜  Local:   http://localhost:5176/
```

### **Step 4: Open in Browser**

Navigate to: **http://localhost:5176**

---

## 🔌 Connection Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Windows Machine                           │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                       │
│  Frontend (React)    │     Backend (Spring Boot)             │
│  Port: 5176         │     Port: 8080                        │
│                      │                                       │
│  ├─ vite.config.js   │     ├─ application.properties         │
│  │  port: 5176       │     │  port: 8080                     │
│  │                   │     │  context-path: /api             │
│  └─ api.js           │     │                                 │
│     baseURL:         │     └─ Controllers                    │
│     localhost:8080   │        ├─ AuthController             │
│                      │        ├─ UserController             │
│                      │        ├─ FoodController             │
│                      │        ├─ MealController             │
│                      │        ├─ DoctorController           │
│                      │        ├─ ChatController             │
│                      │        ├─ AdminController            │
│                      │        └─ HealthController           │
└──────────────────────┴──────────────────────────────────────┘
                            │
                            │ CORS Enabled
                            │ Origin: http://localhost:5176
                            │
                            ▼
                   ┌────────────────┐
                   │  MySQL Database │
                   │  Port: 3306    │
                   │  nutrifit_db   │
                   └────────────────┘
```

---

## 🔐 CORS Configuration Details

**What is CORS?**
- CORS (Cross-Origin Resource Sharing) allows the frontend to make requests to the backend
- Without proper CORS, requests from `localhost:5176` to `localhost:8080` would be blocked

**Default Setting:**
```java
@CrossOrigin(origins = "http://localhost:5176")
```

This allows requests ONLY from `http://localhost:5176` to access the backend APIs.

**For Production:**
Replace `http://localhost:5176` with your actual frontend domain:
```java
@CrossOrigin(origins = "https://yourdomain.com")
```

---

## 📡 API Endpoints

All APIs are accessible at:
```
Base URL: http://localhost:8080/api
```

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/doctor-register` - Doctor registration
- `POST /api/auth/doctor-login` - Doctor login

### User Endpoints
- `GET /api/users/me` - Get current user
- `PUT /api/users/{userId}/profile` - Update profile
- `GET /api/users` - Get all users
- `DELETE /api/users/{userId}` - Delete user

### Food Endpoints
- `GET /api/foods` - Get all foods
- `POST /api/foods` - Create food
- `PUT /api/foods/{foodId}` - Update food
- `DELETE /api/foods/{foodId}` - Delete food

### Meal Endpoints
- `GET /api/meals/today` - Get today's meals
- `GET /api/meals/totals/today` - Get today's nutrition totals
- `POST /api/meals` - Add meal
- `DELETE /api/meals/{mealId}` - Remove meal

### Doctor Endpoints
- `GET /api/doctors` - Get all doctors
- `PATCH /api/doctors/{doctorId}/availability` - Update availability

### Messages Endpoints
- `GET /api/messages/conversation/{doctorId}` - Get conversation
- `POST /api/messages` - Send message
- `PUT /api/messages/{messageId}/rate` - Rate message

### Admin Endpoints
- `GET /api/admin/stats` - Get statistics
- `DELETE /api/admin/users/{userId}` - Delete user

### Health Endpoint
- `GET /api/health` - Health check

---

## ✅ Verification Checklist

Run these checks to verify your setup:

### 1. **Frontend is running:**
   - Visit http://localhost:5176 in your browser
   - You should see the application home page

### 2. **Backend is running:**
   - Visit http://localhost:8080/api/health in your browser
   - You should see: `{"status":"ok"}`

### 3. **Database is connected:**
   - Login or register a user
   - Check if data is saved in MySQL

### 4. **CORS is working:**
   - Open browser DevTools (F12)
   - Check Network tab for any CORS errors
   - All requests to `/api/*` should succeed

### 5. **JWT tokens are working:**
   - After login, check localStorage in browser DevTools
   - You should see `nutrifit_token` stored

---

## 🆘 Troubleshooting

### Frontend can't connect to backend:
1. Verify backend is running on port 8080
2. Check `src/services/api.js` for correct `API_BASE_URL`
3. Open DevTools (F12) → Check Console for CORS errors
4. Verify `@CrossOrigin` annotation in backend controllers

### Backend won't start:
1. Check if MySQL is running
2. Verify database credentials in `application.properties`
3. Check if port 8080 is already in use
4. Run `mvn clean install` to rebuild

### Port already in use:
```bash
# Windows - Find and kill process on port
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in vite.config.js or application.properties
```

### Database connection failed:
1. Ensure MySQL is installed and running
2. Verify credentials: username=`root`, password=`root`
3. Create database: `CREATE DATABASE nutrifit_db;`
4. Check MySQL connection: `mysql -u root -p`

---

## 📦 Port Summary

| Service | Port | Status |
|---------|------|--------|
| Frontend (React/Vite) | 5176 | ✅ Configured |
| Backend (Spring Boot) | 8080 | ✅ Configured |
| Database (MySQL) | 3306 | ✅ Default |

---

## 🎯 Next Steps

1. **Run the backend** - Maven Spring Boot application on 8080
2. **Run the frontend** - React development server on 5176
3. **Test the connection** - Register/login to verify fullstack integration
4. **Check database** - Verify data persistence in MySQL

---

**Project Status:** ✅ Ready for development and testing
