# Connection Verification Checklist

## 📋 Pre-Launch Checklist

### Prerequisites
- [ ] MySQL 8.0+ installed and running
- [ ] Java 17+ installed
- [ ] Maven 3.6+ installed
- [ ] Node.js 16+ installed
- [ ] Port 5176 is available (frontend)
- [ ] Port 8080 is available (backend)
- [ ] Port 3306 is available (MySQL)

### Database Setup
- [ ] MySQL service is running
- [ ] Database `nutrifit_db` is created
- [ ] MySQL credentials verified (root/root)

---

## 🚀 Launch Verification

### Step 1: Backend Startup (Port 8080)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ **Success Indicators:**
- Console shows: `Backend running on http://localhost:8080`
- No error messages about MySQL connection
- No port conflicts

**Test in Browser:**
```
http://localhost:8080/api/health
Expected Response: {"status":"ok"}
```

---

### Step 2: Frontend Startup (Port 5176)
```bash
npm install
npm run dev
```

✅ **Success Indicators:**
- Console shows: `Local: http://localhost:5176/`
- Shows "VITE dev server running"
- No compilation errors

**Test in Browser:**
```
http://localhost:5176
Expected: Application homepage loads
```

---

## 🧪 Connection Testing

### Test 1: Backend API Health
**Open:** http://localhost:8080/api/health

**Expected Response:**
```json
{
  "status": "ok"
}
```

**If Failed:**
- Check if backend is running
- Verify Java and Maven installation
- Check port 8080 availability

---

### Test 2: Frontend Loading
**Open:** http://localhost:5176

**Expected:**
- Application UI loads completely
- No console errors
- Navigation works

**If Failed:**
- Check if frontend dev server is running
- Clear browser cache (Ctrl+Shift+Del)
- Verify Node.js installation: `node -v`

---

### Test 3: CORS Connection
**Open DevTools:** F12 → Console tab

**Do This:** Click "Register" or "Login" button

**Check:**
1. No CORS error messages
2. Network tab shows successful requests to `localhost:8080/api`
3. Requests have response code 200, 201, 400, etc. (not CORS errors)

**If CORS Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify `@CrossOrigin(origins = "http://localhost:5176")` in controllers
2. Rebuild backend: `mvn clean install`
3. Restart backend server
4. Hard refresh frontend (Ctrl+Shift+R)

---

### Test 4: API Request Test
**In Browser Console (F12):**

```javascript
// Test API connection
fetch('http://localhost:8080/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend Connected:', data))
  .catch(err => console.error('❌ Backend Error:', err))
```

**Expected Output:**
```
✅ Backend Connected: {status: 'ok'}
```

---

### Test 5: User Registration Test
**In Application:**

1. Click on "Register" button
2. Enter test email: `test@example.com`
3. Enter password: `Test123456`
4. Submit form

**Check in DevTools (F12):**

- Network tab:
  - Request to: `http://localhost:8080/api/auth/register`
  - Response Status: 201 (Created)
  - Response Body: Contains authentication token

- Console:
  - No CORS errors
  - No timeout errors
  - Success message appears

**Check in Database:**
```sql
SELECT * FROM user;
```

Should show the registered user.

---

### Test 6: Database Connection
**In MySQL:**

```sql
-- Connect to database
USE nutrifit_db;

-- Check tables
SHOW TABLES;

-- Check if registration worked
SELECT id, email, role FROM user LIMIT 5;
```

✅ **Expected:**
- All tables visible
- User data present after registration

---

## 🔧 Configuration Verification

### File 1: vite.config.js
**Path:** `vite.config.js`

**Verify:**
```javascript
server: {
  port: 5176,
  host: 'localhost',
  strictPort: true
}
```

✅ Port should be **5176**

---

### File 2: api.js
**Path:** `src/services/api.js`

**Verify:**
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

✅ Should point to **localhost:8080**

---

### File 3: application.properties
**Path:** `backend/src/main/resources/application.properties`

**Verify:**
```
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/nutrifit_db
```

✅ Port should be **8080**
✅ Database URL should be correct

---

### File 4: Controllers
**Path:** `backend/src/main/java/com/nutrifit/controller/*.java`

**Verify each controller has:**
```java
@CrossOrigin(origins = "http://localhost:5176")
```

Controllers to check:
- [ ] AuthController.java
- [ ] UserController.java
- [ ] FoodController.java
- [ ] MealController.java
- [ ] DoctorController.java
- [ ] ChatController.java
- [ ] AdminController.java
- [ ] HealthController.java

---

## 📊 Status Summary Table

| Component | Port | File | Status | Notes |
|-----------|------|------|--------|-------|
| Frontend | 5176 | vite.config.js | ✅ | Running on 5176 |
| Backend | 8080 | application.properties | ✅ | Running on 8080 |
| Database | 3306 | application.properties | ✅ | MySQL connection |
| CORS | N/A | Controller files | ✅ | localhost:5176 allowed |
| API URL | 8080 | api.js | ✅ | Points to localhost:8080 |

---

## 🎯 Final Verification Steps

Before declaring setup complete:

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Health endpoint returns {"status":"ok"}
- [ ] User can register successfully
- [ ] Data appears in MySQL database
- [ ] No CORS errors in browser console
- [ ] JWT token stored in localStorage after login
- [ ] All API endpoints respond correctly

---

## ✨ Success Criteria

✅ **Setup is complete when:**

1. **Frontend accessible:** http://localhost:5176 loads
2. **Backend accessible:** http://localhost:8080/api/health responds with `{"status":"ok"}`
3. **Database connected:** User registration creates new database record
4. **CORS working:** No CORS errors in browser console
5. **JWT enabled:** Token stored in localStorage after login
6. **All endpoints working:** All API calls succeed

---

## 🆘 Troubleshooting Guide

### Issue: Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8081
```

### Issue: MySQL Connection Refused
```bash
# Start MySQL
mysql -u root -p

# Or create database
CREATE DATABASE nutrifit_db;
```

### Issue: CORS Error
```
Access to XMLHttpRequest... blocked by CORS
```

**Fix:**
1. Verify @CrossOrigin annotation
2. Rebuild backend: `mvn clean install`
3. Restart backend
4. Hard refresh browser: Ctrl+Shift+R

### Issue: 404 Not Found
- Verify API_BASE_URL in api.js
- Check @RequestMapping paths
- Verify context-path is `/api`

### Issue: JWT Not Working
- Check localStorage in browser
- Verify token after login
- Check Authorization header in requests

---

**Last Updated:** 2024
**Status:** Ready for Testing ✅
