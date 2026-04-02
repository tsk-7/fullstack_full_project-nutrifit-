# 🚀 COMPLETE INTEGRATION & TESTING GUIDE

## Step 1: Prepare Your Environment

### Prerequisites Check
```bash
# Check Java version (should be 17+)
java -version

# Check Maven
mvn --version

# Check Node.js & npm
node --version
npm --version

# Check MySQL
mysql --version
```

### Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS nutrifit_db_fresh;

# Use database
USE nutrifit_db_fresh;

# Create tables (use schema.sql from backend/sql/)
SOURCE /path/to/backend/sql/schema.sql;
```

---

## Step 2: Import Food Data

### Option A: Direct MySQL Import
```bash
# Login to MySQL
mysql -u root -p nutrifit_db_fresh

# Paste and run the SQL INSERT statements from FOODS_IMPORT_GUIDE.md
# Or import from file
SOURCE /path/to/FOODS_COMPLETE_INSERT.sql;
```

### Option B: Via phpMyAdmin
1. Open phpMyAdmin
2. Select database `nutrifit_db_fresh`
3. Go to "Import" tab
4. Upload FOODS_IMPORT_GUIDE.md or paste SQL
5. Click "Go"

### Verify Import
```sql
-- Check total foods
SELECT COUNT(*) as total_foods FROM foods;

-- View few foods
SELECT id, name, category, calories FROM foods LIMIT 5;
```

---

## Step 3: Build & Start Backend

### Clean Build
```bash
# Navigate to backend
cd backend

# Clean and build
mvn clean package -DskipTests

# Check if JAR created
ls -lh target/nutrifit-backend-1.0.0.jar
```

### Start Backend Server
```bash
# Option 1: Run JAR directly
cd target
java -jar nutrifit-backend-1.0.0.jar

# Option 2: Run with Maven
cd ..
mvn spring-boot:run

# Wait for message: "Started NutrifitBackendApplication"
# Backend should now be running at: http://localhost:8080
```

### Verify Backend is Running
```bash
# In another terminal
curl http://localhost:8080/api/health

# Should return: {"status":"ok"}
```

---

## Step 4: Configure & Start Frontend

### Install Dependencies
```bash
# Navigate to frontend
cd fullstack-frontend

# Install dependencies
npm install
```

### Check API Configuration
**File**: `src/context/NutritionContext.jsx`

Verify API_BASE_URL is correct:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Start Frontend Dev Server
```bash
# Start Vite dev server
npm run dev

# Frontend should be available at: http://localhost:5173
```

### Verify Frontend is Running
- Open browser: `http://localhost:5173`
- You should see landing page
- No errors in browser console

---

## Step 5: Test All Features

### Test 1: User Registration
```
1. Go to http://localhost:5173/signup
2. Enter:
   - Email: testuser@example.com
   - Password: Password123
   - Age: 25
   - Gender: Male
3. Click Register
4. ✅ Should redirect to login
```

### Test 2: User Login
```
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: testuser@example.com
   - Password: Password123
3. Click Login
4. ✅ Should show dashboard with username
5. ✅ Should have JWT token in localStorage
```

**Verify JWT Token**:
```javascript
// In browser console
localStorage.getItem('token')
// Should see JWT token starting with "eyJ..."
```

### Test 3: Doctor Registration & Login
```
Doctor Dashboard:
1. Go to /doctor-login
2. Register: testdoctor@example.com, Password123
3. Select specialty: Nutritionist, Years: 5
4. Login with same credentials
5. ✅ Should show doctor dashboard
```

### Test 4: Add & Display Meals
```
1. Login as user
2. Go to /diet-analysis
3. Select time: Breakfast
4. Select food: Upma
5. Click "Add Meal"
6. ✅ Meal should appear in table
7. ✅ Nutrition totals should update
8. ✅ Graph should show nutrients
```

**Check in Database**:
```sql
SELECT * FROM meals WHERE user_id = 1;
-- Should see the added meal
```

### Test 5: Delete Meal
```
1. In Diet Analysis, click Delete on meal
2. ✅ Meal should disappear from table
3. ✅ Nutrition totals should recalculate
```

**Check in Database**:
```sql
SELECT COUNT(*) FROM meals WHERE user_id = 1;
-- Count should decrease
```

### Test 6: Send Message
```
Messaging:
1. Login as user
2. Go to /messages
3. Select doctor from dropdown
4. Type message: "Hello, I need diet advice"
5. Click Send
6. ✅ Message should appear in chat
```

**Check in Database:**
```sql
SELECT * FROM messages ORDER BY created_at DESC LIMIT 1;
-- Should see your message
```

### Test 7: Doctor Receives & Replies
```
1. Login as doctor (different browser/incognito)
2. Go to /doctor-messages
3. Select user from dropdown
4. ✅ Should see user's message
5. Type reply: "I can help with that"
6. ✅ Reply should appear
```

**Check in Database:**
```sql
SELECT COUNT(*) FROM messages;
-- Should increase with new message
```

### Test 8: View Nutrition Profile
```
1. Go to /profile
2. ✅ Should show user info
3. Update age, weight, height
4. Click Save
5. ✅ Updates should persist
```

**Check in Database:**
```sql
SELECT age, weight, height FROM users WHERE id = 1;
```

### Test 9: Error Handling
```
Wrong Password:
1. Login page, enter wrong password
2. ✅ Should show error: "Invalid email or password"

Network Error:
1. Stop backend server
2. Try to login
3. ✅ Should show connection error

Missing Fields:
1. Try to add meal without selecting food
2. ✅ Should show: "Please select a food"
```

### Test 10: Admin Features
```
Admin Login:
1. Go to /admin-login
2. Login: admin@example.com, admin123
3. ✅ Should show admin dashboard
4. Go to /admin/food-management
5. ✅ Should list all foods
6. Can add/edit/delete foods
```

---

## Browser DevTools Testing

### Check Network Requests
```
1. Open DevTools (F12) → Network tab
2. Login
3. Should see:
   - POST /api/auth/login → Response has token
   - Token in response: {"token": "eyJ...", "user": {...}}
```

### Check Local Storage
```
1. DevTools → Application → Local Storage
2. Should have:
   - token: YOUR_JWT_TOKEN
   - userId: 123
   - userProfile: {...}
```

### Check Console for Errors
```
1. DevTools → Console
2. Should be CLEAN (no red errors)
3. OK to see INFO/DEBUG logs
4. Look for API response logging:
   - "Data loaded successfully"
   - "Meal added: {meal details}"
```

---

## Troubleshooting

### Backend won't start

**Error**: `java: command not found`
```
Solution: Install Java 17+
On Windows: Download from oracle.com
On Mac: brew install java17
On Linux: sudo apt install openjdk-17-jdk
```

**Error**: `Port 8080 already in use`
```
Solution: 
# Find process using port
netstat -ano | findstr :8080  (Windows)
lsof -i :8080  (Mac/Linux)

# Kill process
taskkill /PID <PID> /F  (Windows)
kill -9 <PID>  (Mac/Linux)

# Or use different port:
Edit application.properties:
server.port=8081
```

**Error**: `Cannot connect to database`
```
Solution:
1. Verify MySQL is running
2. Check database exists: nutrifit_db_fresh
3. Check username/password in application.properties
4. Example MySQL start:
   Windows: mysql --install && net start MySQL
   Mac: brew services start mysql
   Linux: sudo systemctl start mysql
```

---

### Frontend won't load

**Error**: `Cannot find module error`
```
Solution:
npm install
rm -rf node_modules package-lock.json
npm install again
```

**Error**: `CORS error`
```
Solution: Backend CORS is enabled
But verify @CrossOrigin(origins = "*") in controllers
```

**Error**: `Blank page, no errors`
```
Solution:
1. Check DevTools Console
2. Refresh: Ctrl+Shift+R (hard refresh)
3. Check Vite is running: npm run dev
4. Try different port: npm run dev -- --port 5174
```

---

### API calls failing

**Error**: `401 Unauthorized`
```
Solution: 
- Token not sent or expired
- Check localStorage has token
- Check Authorization header in fetch
- JWT secret in backend matches frontend (Base64 string)
```

**Error**: `404 Not Found`
```
Solution:
- Check API endpoint is correct
- Backend mapping: /api/auth, /api/meals, /api/messages
- Frontend call: http://localhost:8080/api/meals
```

**Error**: `500 Internal Server Error`
```
Solution:
1. Check backend logs for exception
2. Verify database connection
3. Check SQL queries in service layer
4. Common issue: @Transactional missing on service
```

---

### Data not persisting

**Problem**: Add meal, refresh, it's gone
```
Solution:
1. Check database: SELECT * FROM meals;
2. If empty:
   a. Check userId is correct
   b. Check @Transactional on MealService
   c. Verify meal is being saved: return mealRepository.save(meal)
```

**Problem**: Doctor not showing in dropdown
```
Solution:
1. Check database: SELECT * FROM doctors;
2. If empty:
   a. Register new doctor first
   b. Check doctor registration API
   c. Verify DoctorService.registerDoctor() saves to DB
```

---

## Test Checklist

- [ ] Backend starts successfully
- [ ] Frontend loads without errors
- [ ] Food database has 65+ items
- [ ] User can register
- [ ] User can login with JWT
- [ ] Username displays in welcome message
- [ ] Meals can be added
- [ ] Meals display immediately
- [ ] Nutrition totals calculate
- [ ] Meals can be deleted
- [ ] Doctors appear in dropdown
- [ ] Messages can be sent
- [ ] Messages persist in database
- [ ] Doctor can receive and reply
- [ ] Error messages display to user
- [ ] No CORS errors
- [ ] No console errors

---

## Database Verification

```sql
-- Check all tables created
SHOW TABLES;

-- Check user table has data
SELECT COUNT(*) as users FROM users;

-- Check doctors
SELECT COUNT(*) as doctors FROM doctors;

-- Check foods
SELECT COUNT(*) as foods FROM foods;

-- Check meals
SELECT COUNT(*) as meals FROM meals;

-- Check messages
SELECT COUNT(*) as messages FROM messages;

-- Example queries:
SELECT u.name, COUNT(m.id) as meal_count 
FROM users u LEFT JOIN meals m ON u.id = m.user_id 
GROUP BY u.id;

SELECT d.name, COUNT(m.id) as message_count
FROM doctors d LEFT JOIN messages m ON d.id = m.sender_doctor_id
GROUP BY d.id;
```

---

## Performance Notes

- Initial load: ~2-3 seconds
- API responses: <500ms average
- Database queries: <100ms
- Frontend re-renders: <50ms

If slower, check:
- MySQL indexes
- Network latency
- Browser DevTools Performance tab
- Backend logs for slow queries

---

## Next Steps After Testing

1. Deploy to production server
2. Update API_BASE_URL to production endpoint
3. Configure SSL/HTTPS
4. Set up database backups
5. Monitor error logs
6. Scale as needed

---

**All features should work end-to-end after following this guide!**
