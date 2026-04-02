# Registration Debugging Guide & Checklist

## 1. REGISTRATION FAILURE CHECKLIST

### ✓ Backend Issues
- [ ] Backend not running (check `http://localhost:8080/api/health`)
- [ ] API endpoint path incorrect (should be `/api/auth/register`)
- [ ] Missing required fields in request
- [ ] Validation error (duplicate email, invalid password format)
- [ ] HTTP 400 Bad Request - check request body structure
- [ ] HTTP 401 Unauthorized - authentication issue
- [ ] HTTP 409 Conflict - user already exists with this email
- [ ] HTTP 500 Internal Server Error - backend exception

### ✓ Frontend/CORS Issues
- [ ] Frontend not sending correct Content-Type header
- [ ] CORS headers missing from backend response
- [ ] Backend not allowing requests from frontend origin
- [ ] API base URL hardcoded wrong (`http://localhost:8080` vs `http://localhost:3000`)
- [ ] Network request blocked by browser console

### ✓ Request Format Issues
- [ ] JSON body not properly formatted
- [ ] Missing query parameters (`?age=X&gender=Y`)
- [ ] Headers not set correctly
- [ ] Axios interceptor modifying request incorrectly
- [ ] Timeout or network error

---

## 2. EXPECTED API ENDPOINT

```
POST /api/auth/register
Query Parameters:
  - age (Integer, optional): User age
  - gender (String, optional): male/female/other

Request Headers:
  Content-Type: application/json

Request Body (JSON):
{
  "email": "user@example.com",
  "password": "password123"
}

Success Response (201 Created):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": null,
    "email": "user@example.com",
    "role": "USER"
  }
}

Error Response (400/409/500):
{
  "error": "Error message explaining what went wrong"
}
```

---

## 3. HOW TO DEBUG IN BROWSER DEVTOOLS

### Step 1: Open Browser DevTools
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Click **Network** tab

### Step 2: Try Registration
- Fill out signup form
- Click "Create Account" button

### Step 3: Inspect Network Request
- Look for a POST request to `http://localhost:8080/api/auth/register?...`
- Click on it to expand

### Step 4: Check REQUEST Tab
```
Method: POST
URL: http://localhost:8080/api/auth/register?age=19&gender=Male
Headers:
  - Content-Type: application/json
  - Authorization: (shouldn't be needed for registration)

Request Payload (should look like):
{
  "email": "sai@gmail.com",
  "password": "password123"
}
```

### Step 5: Check RESPONSE Tab
- **Status 201** = Success (should see token and user data)
- **Status 400** = Bad request (check error message)
- **Status 409** = Email already exists
- **Status 500** = Backend error (check backend console)

### Step 6: Check CONSOLE Tab
- Look for error messages in red
- Check if there are CORS errors

---

## 4. BACKEND VALIDATION REQUIREMENTS

When registering, the backend checks:

✓ **Email field**:
  - Must be provided (not null/empty)
  - Must be valid email format
  - Must be unique (not already registered)

✓ **Password field**:
  - Must be provided (not null/empty)
  - No length requirement currently

✓ **Age parameter** (optional):
  - Can be null

✓ **Gender parameter** (optional):
  - Can be null
  - Expected values: "Male", "Female", "Other"

---

## 5. COMMON ERRORS & SOLUTIONS

### Error: "Registration failed" (Generic)
**Cause**: Frontend error handling too generic
**Fix**: Update React to show actual backend error message

### Error: 400 Bad Request
**Cause**: Invalid JSON format or missing fields
**Solution**:
```javascript
// WRONG:
{ email: "test@example.com" }  // Missing 'password'

// CORRECT:
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Error: 409 Conflict
**Cause**: This email is already registered
**Solution**: Try with different email address

### Error: CORS Error in Console
**Cause**: Backend CORS not configured correctly
**Solution**: Backend is already fixed with `@CrossOrigin(origins = "*")`

---

## 6. CORRECT AXIOS REQUEST

```javascript
// CORRECT IMPLEMENTATION
const registerUser = async (email, password, age, gender) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/auth/register?age=${age}&gender=${gender}`,
      {
        email: email,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    // IMPORTANT: Show actual error from backend
    if (error.response && error.response.data) {
      console.error('Backend error:', error.response.data.error);
      throw new Error(error.response.data.error);
    } else {
      console.error('Network error:', error.message);
      throw new Error('Network error: ' + error.message);
    }
  }
};
```

---

## 7. TEST STEPS

### Quick Test 1: Backend is Running
```bash
curl http://localhost:8080/api/health
# Should return: {"status":"ok"}
```

### Quick Test 2: Test Registration Endpoint
```bash
# Using PowerShell:
$body = @{email="test$(Get-Random)@test.com"; password="pass123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register?age=25&gender=Male" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body `
  -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Step 3: Frontend Test
1. Open http://localhost:5174 in browser
2. Go to "Sign Up" page
3. Fill form with:
   - Full Name: Test User
   - Email: test@example.com
   - Age: 25
   - Gender: Male
   - Password: password123
   - Confirm Password: password123
4. Click "Create Account"
5. Check DevTools Network tab for response

---

## 8. THINGS TO CHECK IF STILL FAILING

1. **Is backend running?**
   ```
   Check terminal tab with Java process
   Look for "Started NutrifitBackendApplication"
   ```

2. **Is frontend running?**
   ```
   Check browser console for errors
   Look for red error messages
   ```

3. **Is database connected?**
   ```
   Backend logs should show Hibernate tables created
   No "Connection refused" errors
   ```

4. **Are parameters being sent?**
   ```
   Open DevTools Network tab
   Click the register request
   Check "Request" tab → "Payload"
   Should show { "email": "...", "password": "..." }
   ```

5. **What's the actual HTTP status?**
   ```
   DevTools Network tab → Status code
   201 = Success
   400 = Bad request
   409 = Conflict (email exists)
   500 = Backend error
   ```

---

## 9. NEXT STEPS IF REGISTRATION SUCCEEDS

Once you successfully register:
1. You should see token in response
2. Frontend should save token to localStorage
3. Redirect to Profile page
4. Fill in name, height, weight, etc.
5. Complete profile and go to Dashboard

---

## 10. USEFUL LINKS

- Backend API Base: `http://localhost:8080/api`
- Frontend: `http://localhost:5174`
- Authentication Endpoint: `POST /api/auth/register`
- Health Check: `GET /api/health`
- Doctors List: `GET /api/doctors`
