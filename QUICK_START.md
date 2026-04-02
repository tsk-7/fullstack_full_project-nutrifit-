# 🚀 Quick Start - Run Fullstack Project

## System Requirements
- ✅ Node.js 16+ (for frontend)
- ✅ Java 17+ (for Spring Boot backend)
- ✅ Maven 3.6+ (for building backend)
- ✅ MySQL 8.0+ (for database)

---

## ⚡ Quick Start Commands

### Terminal 1: Start Backend (Port 8080)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Wait for:** `Backend running on http://localhost:8080`

---

### Terminal 2: Start Frontend (Port 5176)
```bash
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:5176/`

---

### Browser: Access Application
```
http://localhost:5176
```

---

## 🔍 What Was Changed?

### 1. Vite Configuration
**File:** `vite.config.js`
```javascript
server: {
  port: 5176,
  host: 'localhost',
  strictPort: true
}
```

### 2. Spring Boot Controllers
**Files:** All controllers in `backend/src/main/java/com/nutrifit/controller/`
```java
@CrossOrigin(origins = "http://localhost:5176")
public class YourController {
  // Your endpoints
}
```

### 3. Frontend API Configuration
**File:** `src/services/api.js`
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### 4. Backend Configuration
**File:** `backend/src/main/resources/application.properties`
```
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/nutrifit_db
```

---

## ✅ Verify Setup

1. **Backend Health Check:**
   ```
   http://localhost:8080/api/health
   Response: {"status":"ok"}
   ```

2. **Frontend Access:**
   ```
   http://localhost:5176
   Should load the application
   ```

3. **Database:**
   - Try registering a new user
   - Data should be saved in MySQL `nutrifit_db`

---

## 🆘 Common Issues & Solutions

### Problem: Port 8080 already in use
```bash
# Find process
netstat -ano | findstr :8080

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Problem: MySQL connection failed
```bash
# Start MySQL service
mysql -u root -p

# Create database
CREATE DATABASE nutrifit_db;
```

### Problem: CORS error in browser console
- Verify `@CrossOrigin(origins = "http://localhost:5176")` is set
- Rebuild backend: `mvn clean install`
- Clear browser cache (Ctrl+Shift+Del)

### Problem: Frontend can't find backend
- Check API_BASE_URL in `src/services/api.js`
- Verify it says `http://localhost:8080/api`
- Restart frontend dev server

---

## 📊 Connection Flow

```
User Browser (http://localhost:5176)
        │
        ├─ User Registration/Login
        │
        ▼
React Frontend (Port 5176)
        │
        │ HTTP Request
        │ Authorization Header
        │
        ▼
Spring Boot Backend (Port 8080)
        │
        ├─ @CrossOrigin validates origin ✓
        ├─ JWT validation ✓
        │
        ▼
MySQL Database (localhost:3306)
        │
        └─ Save/Retrieve Data
```

---

## 🎯 Architecture Overview

| Component | Port | Language | Purpose |
|-----------|------|----------|---------|
| Frontend | 5176 | React/JavaScript | User Interface |
| Backend | 8080 | Java/Spring Boot | API & Business Logic |
| Database | 3306 | MySQL | Data Persistence |

---

## 📖 Available Endpoints

**All APIs:** `http://localhost:8080/api`

- **Auth:** `/auth/register`, `/auth/login`, `/auth/doctor-register`, `/auth/doctor-login`
- **Users:** `/users/me`, `/users/{id}/profile`, `/users`
- **Foods:** `/foods`, `/foods/{id}`
- **Meals:** `/meals/today`, `/meals/totals/today`, `/meals/{id}`
- **Doctors:** `/doctors`, `/doctors/{id}/availability`
- **Messages:** `/messages/conversation/{doctorId}`, `/messages/{id}/rate`
- **Admin:** `/admin/stats`, `/admin/users/{id}`
- **Health:** `/health`

---

## 🔐 CORS Details

**What:** Cross-Origin Resource Sharing allows frontend (5176) to communicate with backend (8080)

**Configured in:** All 8 Spring Boot Controllers
```java
@CrossOrigin(origins = "http://localhost:5176")
```

**For Production:** Change to your actual domain
```java
@CrossOrigin(origins = "https://yourdomain.com")
```

---

**Status:** ✅ All systems configured and ready to run
