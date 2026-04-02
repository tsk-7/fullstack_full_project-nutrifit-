# 🧪 Complete Testing Guide - Registration Flow

## ✅ Status: ALL SYSTEMS OPERATIONAL

```
BACKEND:  http://localhost:8080/api ✅
FRONTEND: http://localhost:5175    ✅
DATABASE: MySQL nutrifit_db_fresh  ✅
```

---

## 🎯 What Was Fixed

### 1. Database Schema Error ✅
**Problem**: `Table 'nutrifit_db_fresh.conversations' doesn't exist`
```
spring.jpa.hibernate.ddl-auto=create-drop  ← WRONG
```

**Fixed**: Changed to
```
spring.jpa.hibernate.ddl-auto=update  ← CORRECT
```

### 2. Missing Dependency ✅
**Problem**: `Failed to resolve import "axios"`

**Fixed**: 
```bash
npm install axios
```

---

## 🚀 How to Test Complete Application

### Open Application
1. Open browser: **http://localhost:5175**
2. Should see landing page with "Sign Up" button

---

## 📝 Test Registration (Step-by-Step)

### Step 1: Open DevTools FIRST
```
Press F12 on your keyboard
→ Click "Network" tab
→ Leave it open while testing
```

### Step 2: Fill Registration Form
```
Click "Sign Up" button
→ Select Role: "User"
→ Email: testuser01@example.com  (use unique email)
→ Password: Password123
→ Age: 25
→ Gender: Male
→ Click "Register"
```

### Step 3: Check Network Request
In DevTools Network tab:
1. Look for request: `POST /auth/register`
2. Click on it
3. Switch to "Response" tab
4. Should see:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "testuser01@example.com",
    "name": null,
    "role": "USER"
  }
}
```
5. Status should be `201 Created` (green)

### Step 4: Check Console Logs
In DevTools Console tab:
```
📤 Request: POST http://localhost:8080/api/auth/register
✅ Registration successful: {...}
```

Or if error:
```
❌ Registration failed: {error message}
```

### Step 5: Verify in Backend Logs
Backend terminal should show:
```
[INFO] ... : User registered successfully
[DEBUG] ... : Generated JWT token: eyJ...
```

### Step 6: Check MySQL Database
Option A - Via Command Line:
```bash
mysql -u root -p root
USE nutrifit_db_fresh;
SELECT id, email, role, created_at FROM users;
```

Should show new user:
```
| id | email                   | role | created_at              |
|----|-------------------------|------|-------------------------|
| 1  | testuser01@example.com  | USER | 2026-03-28 04:47:30     |
```

Option B - Via MySQL GUI Client:
1. Connect to localhost:3306
2. Database: `nutrifit_db_fresh`
3. Table: `users`
4. You should see the newly inserted user

---

## ✅ Success Criteria

✅ **Registration form submits without errors**
✅ **Network request shows 201 status code**
✅ **Response contains valid JWT token**
✅ **Response contains user data (id, email, role)**
✅ **No error messages in console**
✅ **User data appears in MySQL database**
✅ **Frontend redirects to dashboard** (if implemented)
✅ **JWT token saved to localStorage**

---

## 🔄 Test Duplicate Email (Error Handling)

### Try registering with SAME email:
```
Email: testuser01@example.com  (same as before)
Password: AnyPassword123
→ Click "Register"
```

### Expected Result:
- Network request shows **409 Conflict** status (orange)
- Response shows:
```json
{
  "error": "User already exists with this email"
}
```
- Browser shows error message: "This email is already registered"
- No new user added to database
- User not redirected

---

## 🔐 Test Login

### Step 1: Fill Login Form
```
Email: testuser01@example.com
Password: Password123
→ Click "Login"
```

### Step 2: Check DevTools
- Look for POST to `/auth/login`
- Status: `200 OK` (green)
- Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "testuser01@example.com",
    "name": null,
    "role": "USER"
  }
}
```

### Step 3: Invalid Password
```
Email: testuser01@example.com
Password: WrongPassword
→ Click "Login"
```

- Status: `401 Unauthorized` (orange/red)
- Response:
```json
{
  "error": "Invalid email or password"
}
```
- Show error message, don't login

---

## 🐛 If Tests Fail - Debugging

### Error: "Backend not responding"
```bash
# Check if backend process exists
Get-Process java

# If not running, start it:
cd "C:\Users\HP\OneDrive\Desktop\fullstack-frontend\backend\target"
java -jar nutrifit-backend-1.0.0.jar

# Wait for startup (2-3 seconds), you should see:
# "Started NutrifitBackendApplication in X seconds"
```

### Error: "No Network Request Appearing"
```bash
# Check if axios is installed
npm list axios

# If not:
npm install axios

# Restart frontend:
# Kill terminal and run: npm run dev
```

### Error: "Network Error: No response from server"
```bash
# Check MySQL is running
mysql -u root -p root -e "SHOW DATABASES;"

# Should show: nutrifit_db_fresh

# If error, MySQL not running. Start it:
# Windows: Open Services → Find MySQL → Start
# Or: net start MySQL80
```

### Error: "200 response but no data"
```bash
# Check backend logs for exceptions
# Backend terminal should show errors like:
# ERROR ... : Exception in registerUser()

# Common issues:
# 1. Password too short (need 8+ characters)
# 2. Invalid email format
# 3. Database transaction failed
# 4. Unique constraint violation
```

---

## 🔍 Complete Debugging Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5175
- [ ] MySQL database exists: `nutrifit_db_fresh`
- [ ] Can connect to MySQL: `mysql -u root -p root`
- [ ] Axios installed: `npm list axios`
- [ ] No JavaScript errors in console (F12 → Console)
- [ ] Network tab shows HTTP requests
- [ ] POST requests return 201/200 status
- [ ] Responses contain token and user data
- [ ] User data appears in database
- [ ] Duplicate email returns 409 error
- [ ] Invalid password returns 401 error

---

## 📊 Expected Data Flow

### Successful Registration:

```
USER FORM
   ↓
{email: "test@example.com", password: "Pass123"}
   ↓
React Signup.jsx
   ↓
NutritionContext registerUser()
   ↓
authAPI.registerUser()  (api.js)
   ↓
HTTP: POST /auth/register
   ↓
Backend: AuthService.registerUser()
   ├─ Check: existsByEmail() → No duplicate ✓
   ├─ Encode: BCrypt password ✓
   └─ Save: userRepository.save() ✓
   ↓
MySQL: INSERT INTO users (...)
   ↓
HTTP Response: 201 Created
{
  "token": "eyJ...",
  "user": {id: 1, email: "test@example.com", role: "USER"}
}
   ↓
Frontend: 
├─ Saved JWT token ✓
├─ Saved UserID ✓
├─ Update state ✓
└─ Redirect to dashboard ✓
```

---

## 📈 Example Test Scenarios

### Scenario 1: First User Registration ✅
```
Email: john@example.com
Password: SecurePass123
Age: 28
Gender: Male

Expected: Success 201, user saved
Database: 1 user total
```

### Scenario 2: Duplicate Email ❌
```
Email: john@example.com  (already exists)
Password: DifferentPass123
Age: 30
Gender: Female

Expected: Error 409 "User already exists"
Database: Still 1 user total (not added)
```

### Scenario 3: Invalid Password Length ❌
```
Email: jane@example.com
Password: Abc  (too short)
Age: 25
Gender: Female

Expected: Error 400 "Invalid input"
or: Server validation catches and returns error
```

### Scenario 4: Malformed Email ❌
```
Email: invalid-email  (missing @domain)
Password: ValidPass123
Age: 25
Gender: Female

Expected: Error 400 or validation message
```

---

## 🎓 What Each Component Does

### Frontend (React)
- **Signup.jsx**: Form UI, captures user input
- **NutritionContext.jsx**: Global state, calls authAPI
- **api.js**: HTTP service, error handling, JWT token

### Backend (Spring Boot)
- **AuthController.java**: API endpoints, HTTP responses
- **AuthService.java**: Business logic, validation, database calls
- **PasswordEncoder**: BCrypt hashing
- **JwtTokenProvider.java**: Token generation

### Database (MySQL)
- **users table**: Stores user credentials and profile

---

## 🚀 Next Steps After Successful Registration

1. **Profile Completion** (if implemented)
   - User fills in name, height, weight, date of birth
   - Marks profileComplete = true

2. **Dashboard** 
   - Shows user's meals for today
   - Shows nutrition summary

3. **Add Meals**
   - User can log meals they've eaten
   - Backend calculates calories, macros

4. **Doctor Features** (if user is doctor)
   - View patient list
   - Send messages to patients

---

## 📞 Quick Reference Commands

### Start Everything
```bash
# Terminal 1: Backend
cd c:\Users\HP\OneDrive\Desktop\fullstack-frontend\backend\target
java -jar nutrifit-backend-1.0.0.jar

# Terminal 2: Frontend  
cd c:\Users\HP\OneDrive\Desktop\fullstack-frontend
npm run dev

# Terminal 3: Monitor MySQL (optional)
mysql -u root -p root nutrifit_db_fresh
mysql> SELECT COUNT(*) FROM users;
```

### Check Databases
```bash
# List all databases
mysql -u root -p root -e "SHOW DATABASES;"

# Show tables in nutrifit_db_fresh
mysql -u root -p root -e "USE nutrifit_db_fresh; SHOW TABLES;"

# Show all users
mysql -u root -p root -e "USE nutrifit_db_fresh; SELECT * FROM users;"

# Delete test user
mysql -u root -p root -e "USE nutrifit_db_fresh; DELETE FROM users WHERE email = 'test@example.com';"
```

### Stop Services
```bash
# Kill Java (backend)
Get-Process java | Stop-Process -Force

# Kill Node (frontend)
# Use Ctrl+C in the npm run dev terminal
```

---

## ⚠️ Common Test Mistakes

| ❌ Mistake | ✅ Correct |
|-----------|-----------|
| Not checking DevTools Response tab | Always check Response in Network tab |
| Submitting form without DevTools | Open DevTools BEFORE submitting |
| Assuming "success" without checking DB | Always verify in MySQL |
| Registering same email twice expecting success | Should return 409 error |
| Not waiting for backend to start | Wait 2-3 seconds after starting |
| Not checking HTTP status code | 201 created, 200 ok, 409 conflict matter |
| Clearing localStorage accidentally | Don't clear! JWT token needed |
| Testing with offline backend | Always start backend first |

---

## 🎯 Success!

If you see:
- ✅ User form accepts input
- ✅ Network request sent successfully
- ✅ Response shows 201 status
- ✅ Token and user data returned
- ✅ User appears in MySQL
- ✅ No console errors
- ✅ Duplicate email rejected with error

**Then your full-stack application is working perfectly!** 🎉

---

**Last Updated**: March 28, 2026  
**Version**: 1.0.0  
**Status**: ✅ Ready for Testing

