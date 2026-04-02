# Full-Stack Debugging Guide - NutriFit Application

## 🔧 Issues Fixed

### Issue 1: "Table 'nutrifit_db_fresh.conversations' doesn't exist"
**Root Cause**: Database DDL strategy was set to `create-drop`, which tries to DROP tables before CREATE. This fails if tables don't exist yet.

**Solution**: Changed `spring.jpa.hibernate.ddl-auto=create-drop` → `spring.jpa.hibernate.ddl-auto=update`
- `update`: Creates tables if they don't exist, updates schema if needed
- `create-drop`: Drops all tables then creates them (only for dev/testing)

**File**: `backend/src/main/resources/application.properties`
```properties
# BEFORE (broken)
spring.jpa.hibernate.ddl-auto=create-drop

# AFTER (fixed)
spring.jpa.hibernate.ddl-auto=update
```

---

### Issue 2: Missing Dependency - Axios
**Root Cause**: Frontend React code imported axios but package wasn't installed.

**Solution**: Installed axios package
```bash
npm install axios
```

**File**: `frontend/src/services/api.js` uses Axios for HTTP requests

---

## ✅ How Data Flows (Correct Architecture)

### Registration Flow

```
1. USER FILLS FORM
   ↓
2. REACT (Signup.jsx)
   registerUser(email, password, age, gender)
   ↓
3. CONTEXT (NutritionContext.jsx)
   await authAPI.registerUser(...)
   ↓
4. AXIOS SERVICE (api.js)
   axiosInstance.post('/auth/register', {email, password}, {params: {age, gender}})
   ↓
5. SPRING BOOT (AuthController.java)
   POST /auth/register
   → Validates uniqueness
   → Saves to database
   → Returns ResponseEntity with token
   ↓
6. MYSQL DATABASE
   Inserts into users table
   ↓
7. RESPONSE BACK TO FRONTEND
   {
     "token": "eyJhbGc...",
     "user": {
       "id": 1,
       "email": "user@example.com",
       "name": "",
       "role": "USER"
     }
   }
   ↓
8. REACT UPDATES STATE
   setJwtToken(data.token)
   setUserId(data.user.id)
   ↓
9. REDIRECT TO DASHBOARD
```

---

## 🛠️ Backend Code (Spring Boot)

### 1. Entity Mapping (Hibernate)
**File**: `backend/src/main/java/com/nutrifit/entity/User.java`

```java
@Entity
@Table(name = "users")  // ← Table name in MySQL
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;      // ← Unique constraint prevents duplicates
    
    @Column(nullable = false)
    private String passwordHash;  // ← Encrypted password
    
    @Enumerated(EnumType.STRING)
    private UserRole role;     // ← USER, DOCTOR, ADMIN
    
    private Boolean profileComplete;
    
    // Getters & Setters
}
```

**Key Points**:
- `@Entity` tells Hibernate this is a database entity
- `@Table(name = "users")` creates table named "users" (not "user")
- `unique = true` on email prevents duplicate registrations
- `nullable = false` makes field required in database

---

### 2. Repository (Database Access)
**File**: `backend/src/main/java/com/nutrifit/repository/UserRepository.java`

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);  // ← Find user by email
    boolean existsByEmail(String email);       // ← Check if email exists
}
```

**Key Points**:
- `existsByEmail()` checks for duplicates before saving
- `findByEmail()` used for login validation
- JpaRepository provides save(), delete(), findById() etc automatically

---

### 3. Service Layer (Business Logic)
**File**: `backend/src/main/java/com/nutrifit/service/AuthService.java`

```java
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User registerUser(String name, String email, String password, Integer age, String gender) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User already exists with this email");
        }
        
        // 2. Create new user object
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));  // ← Encrypt password
        user.setAge(age);
        user.setGender(gender);
        user.setRole(UserRole.USER);
        user.setProfileComplete(false);
        
        // 3. Save to database
        return userRepository.save(user);  // ← Saves and returns User with ID
    }
    
    public User loginUser(String email, String password) {
        // 1. Find user by email
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        User user = userOpt.get();
        
        // 2. Check password matches
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        return user;
    }
}
```

**Key Points**:
- `existsByEmail()` prevents duplicate registration
- `passwordEncoder.encode()` hashes password (BCrypt)
- `passwordEncoder.matches()` compares entered password with hash
- Service handles business logic, not the controller

---

### 4. Controller (API Endpoints)
**File**: `backend/src/main/java/com/nutrifit/controller/AuthController.java`

```java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")  // ← Allow frontend requests
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest request,
                                          @RequestParam(required = false) Integer age,
                                          @RequestParam(required = false) String gender) {
        try {
            // 1. Call service to register (saves to DB)
            User user = authService.registerUser("", request.getEmail(), 
                                                 request.getPassword(), age, gender);
            
            // 2. Generate JWT token
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
            
            // 3. Create response DTO (no password in response!)
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().toString());
            
            // 4. RETURN 201 CREATED with token and user data
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(token, userDto));
        
        } catch (IllegalArgumentException e) {
            // Duplicate email error
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(java.util.Map.of("error", e.getMessage()));
        
        } catch (Exception e) {
            // Other errors
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest request) {
        try {
            User user = authService.loginUser(request.getEmail(), request.getPassword());
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().toString());
            
            // RETURN 200 OK on success
            return ResponseEntity.ok(new AuthResponse(token, userDto));
        
        } catch (IllegalArgumentException e) {
            // Invalid email or password
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "Invalid email or password"));
        
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Login failed: " + e.getMessage()));
        }
    }
}
```

**Key Points**:
- Always return `ResponseEntity` with proper HTTP status codes
- 201 CREATED for successful registration
- 200 OK for successful login
- 409 CONFLICT for duplicate email
- 401 UNAUTHORIZED for invalid credentials
- 400 BAD REQUEST for validation errors
- NEVER return empty body - always include error message
- DTO ([Data Transfer Object](https://www.baeldung.com/java-dto-pattern)) never includes password

---

## 🔗 Frontend Code (React)

### 1. Axios Service Layer
**File**: `frontend/src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor - add JWT token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('nutrifit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  registerUser: async (email, password, age, gender) => {
    try {
      console.log('📤 Registering user...', { email, age, gender });
      
      const response = await axiosInstance.post('/auth/register', 
        { email, password },
        { params: { age, gender } }
      );
      
      console.log('✅ Registration successful:', response.data);
      return response.data;
    
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (data?.error) {
          errorMessage = data.error;  // ← Use backend error message
        } else if (status === 409) {
          errorMessage = 'This email is already registered';
        } else if (status === 400) {
          errorMessage = 'Invalid email or password format';
        } else if (status === 500) {
          errorMessage = 'Server error - please try again later';
        }
        
        console.error(`HTTP ${status}:`, errorMessage);
      } else if (error.request) {
        errorMessage = 'No response from server - check if backend is running';
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  loginUser: async (email, password) => {
    try {
      console.log('📤 Logging in user...', { email });
      
      const response = await axiosInstance.post('/auth/login', { email, password });
      console.log('✅ Login successful:', response.data);
      return response.data;
    
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      throw new Error(errorMessage);
    }
  }
};

export default axiosInstance;
```

**Key Points**:
- `baseURL`: All requests go to `http://localhost:8080/api`
- Request interceptor adds JWT token to Authorization header
- Response interceptor extracts error messages from backend
- Console logging with emoji for easy debugging
- Extracts meaningful error messages instead of generic text

---

### 2. Context API (State Management)
**File**: `frontend/src/context/NutritionContext.jsx`

```javascript
import { authAPI } from '../services/api';

const registerUser = async (email, password, age, gender) => {
  try {
    setLoading(true);
    setError(null);
    
    // Call backend API
    const data = await authAPI.registerUser(email, password, age, gender);
    
    // Save token and user info
    setJwtToken(data.token);
    setUserId(data.user?.id);  // ← Extract user ID from response
    setUserProfile(data.user || {});
    
    return true;
  
  } catch (err) {
    // Shows actual backend error message
    const errorMsg = err.message || 'Registration failed';
    setError(errorMsg);
    return false;
  
  } finally {
    setLoading(false);
  }
};
```

**Key Points**:
- Uses `authAPI.registerUser()` from api.js service
- Extracts `data.token` and `data.user` from response
- Sets error to actual backend message
- Save JWT token to localStorage for authenticated requests

---

### 3. Signup Component
**File**: `frontend/src/pages/Signup.jsx`

```javascript
import { useNutrition } from '../context/NutritionContext';

export default function Signup() {
  const { registerUser, contextError, loading } = useNutrition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await registerUser(email, password, parseInt(age), gender);
    
    if (success) {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
    // Error already shown in UI via contextError
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <input value={age} onChange={(e) => setAge(e.target.value)} />
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option>Select Gender</option>
        <option>Male</option>
        <option>Female</option>
      </select>
      
      {contextError && <p className="error">{contextError}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

**Key Points**:
- Calls `registerUser()` from context (which uses API service)
- Displays `contextError` which contains backend error message
- Shows loading state during request
- Redirects on success

---

## 🗄️ Database Configuration

**File**: `backend/src/main/resources/application.properties`

```properties
# MySQL Connection
spring.datasource.url=jdbc:mysql://localhost:3306/nutrifit_db_fresh?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate/JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update         # ← CREATE table if not exists, UPDATE schema
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080
spring.application.name=nutrifit-backend
spring.servlet.context-path=/api            # ← API routes are /api/...

# JWT Configuration
app.jwt.secret=nutrifit_super_secret_key_replace_in_production_with_strong_key
app.jwt.expiration-ms=604800000             # 7 days in milliseconds
```

**Table Created**:
```sql
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  age INT,
  gender VARCHAR(30),
  height DOUBLE,
  weight DOUBLE,
  date_of_birth VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  profile_complete BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

---

## 🐛 Debugging Checklist

### When "Registration failed" appears:

1. **Open DevTools** (F12 → Network tab)
2. **Fill registration form** and submit
3. **Look for POST to `/auth/register`** and click it
4. **Check Response tab**:
   - ✅ Status 201 = Success
   - ❌ Status 409 = Email already registered
   - ❌ Status 400 = Invalid input
   - ❌ Status 500 = Database error

5. **Check Response body**:
   ```json
   {
     "token": "eyJhbGc...",
     "user": {
       "id": 1,
       "email": "user@example.com",
       "role": "USER"
     }
   }
   ```

6. **Open Console tab** and look for:
   ```
   📤 Request: POST http://localhost:8080/api/auth/register
   ✅ Registration successful: {...}
   ```

---

## 🚀 Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `@Table(name = "user")` | `@Table(name = "users")` (plural) |
| `ddl-auto=create-drop` | `ddl-auto=update` (for production) |
| `return Response.ok().build()` | `return ResponseEntity.status(201).body(data)` |
| No error in response body | Always return `{"error": "message"}` |
| `fetch()` instead of Axios | Use centralized Axios service |
| Direct fetch in component | Use Context → API Service → Fetch |
| `localStorage.getItem('token')` | `JSON.parse(localStorage.getItem('token'))` |
| No Authorization header | Add `Bearer ${token}` in request |

---

## 📊 Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Success | Login successful |
| 201 | Created - Success | Registration successful |
| 400 | Bad Request | Invalid email format |
| 401 | Unauthorized | Wrong password |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Database connection failed |

---

## 🔐 JWT Token Flow

1. **Registration/Login Success**:
   ```
   Backend returns: {token: "eyJhbGc...", user: {...}}
   Frontend saves: localStorage.setItem('nutrifit_token', token)
   ```

2. **Protected API Calls**:
   ```
   Frontend sends: Authorization: Bearer eyJhbGc...
   Backend validates JWT and processes request
   ```

3. **Expired Token**:
   ```
   Backend returns: 401 Unauthorized
   Frontend removes token and redirects to login
   ```

---

## 📝 Next Steps

✅ **Completed**:
- Fixed database schema (changed create-drop → update)
- Installed axios dependency
- Fixed all error responses to return JSON
- Created comprehensive API service
- Integrated frontend with backend

**To Test**:
1. Open http://localhost:5175
2. Click "Sign Up"
3. Enter: email, password, age, gender
4. Check DevTools → Network → Response (should be 201)
5. Should redirect to Dashboard

**If it still fails**:
1. Check backend logs for errors
2. Verify MySQL is running: `mysql -u root -p root -e "USE nutrifit_db_fresh; SHOW TABLES;"`
3. Check browser console for specific error messages

