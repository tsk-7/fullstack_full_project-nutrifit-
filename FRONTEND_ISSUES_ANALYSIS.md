# Frontend Issues - Detailed Analysis

## 1. NutritionContext.jsx - JWT Token Storage & API Calls

### ✅ JWT Token Handling - CORRECT
**Storage:**
- Stores JWT in localStorage with key: `nutrifit_token`
- Uses `JSON.stringify()` and `JSON.parse()` correctly
- Token is retrieved and used in Authorization header as: `Bearer ${jwtToken}`

**Issue 1: Mixed API Implementation** ⚠️ CRITICAL
- **PROBLEM**: The context uses BOTH `fetch` and `axios`:
  - `authAPI` (in api.js) uses `axios` with interceptors
  - Direct fetch calls in context for `/meals`, `/users/me`, `/messages`
  - This creates inconsistency and reduces code maintainability

- **Example of the problem**:
  ```javascript
  // In api.js - using axios
  const response = await axiosInstance.post('/auth/login', { email, password });
  
  // In context - using fetch for meals
  const response = await fetch(`${API_BASE_URL}/meals/today?userId=${userId}`, {
    headers: { 'Authorization': `Bearer ${jwtToken}` }
  });
  ```

**Impact**: If JWT interceptor needs changes, must update both places

**Recommendation**: Migrate ALL API calls in NutritionContext to use axios from api.js

---

### Issue 2: getMessages is Async but Context Doesn't Await ⚠️ CRITICAL
**In Messages.jsx (line 8):**
```javascript
const messages = currentDoctor ? getMessages(currentDoctor.id) : [];
```

**Problem**: 
- `getMessages()` is an async function but it's being called without await
- Returns a Promise, not the actual messages array
- Messages won't display until component re-renders

**In NutritionContext (line 313):**
```javascript
const getMessages = async (doctorId) => {
    if (!userId) return [];
    try {
        const response = await fetch(`${API_BASE_URL}/messages/conversation/${doctorId}...`);
        // ...
        setChatMessages(prev => ({ ...prev, [messageKey]: messages }));
        return messages;
    }
    // ...
};
```

**Impact**: Messages page will initially show "No messages" even if messages exist

**Recommendation**: Either:
1. Call `getMessages()` in a useEffect, OR
2. Keep messages in context and retrieve them on component mount

---

### Issue 3: Missing Error Propagation to UI ⚠️ MEDIUM
**Problem**: Errors are logged to console but not shown to user in several places:
- `fetchDoctors()` - line 87: `setError('Failed to load doctors')` but never cleared
- `fetchUserProfile()` - line 99: catches error but only logs
- `fetchTodayMeals()` - line 112: catches error but only logs
- `fetchMealTotals()` - line 125: catches error but returns null silently

**Example:**
```javascript
const fetchUserProfile = async () => {
    try {
        // ...
    } catch (err) {
        console.error('Error fetching profile:', err);  // ❌ User never sees this
    }
};
```

**Recommendation**: Set `error` state consistently:
```javascript
catch (err) {
    setError('Failed to fetch profile');
    console.error(...)
}
```

---

### Issue 4: Query Parameter vs Request Body Inconsistency ⚠️ MEDIUM
**Problem**: Some endpoints use query params while POST/PUT should use request body:

```javascript
// ❌ Using query params for registration parameters
const response = await axiosInstance.post(`/auth/register`, 
    { email, password },
    { params: { age, gender } }  // AGE & GENDER as query params!
);

// ✅ Correct for GET (in context)
const response = await fetch(`${API_BASE_URL}/meals/today?userId=${userId}`, ...);
```

**Backend expects**: POST body OR query params?
**Impact**: If backend expects body, registration fails

**Recommendation**: Verify with backend and consolidate - either:
- PUT all data in request body: `{ email, password, age, gender }`
- OR keep as query params but document

---

## 2. Login.jsx & Signup.jsx - JWT & Error Handling

### ✅ Token Storage - CORRECT
- Both components use `useNutrition()` context
- JWT is stored via context's `loginUser()` and `registerUser()`
- Token key: `nutrifit_token` (correct)

### Issue 5: Error State Duplication ⚠️ MEDIUM
**In both Login.jsx and Signup.jsx:**
```javascript
const [error, setError] = useState('');
const { loginUser, loading, error: contextError } = useNutrition();

// Both states exist but logic is unclear
const handleSubmit = async (e) => {
    setError('');  // Clear LOCAL error
    const success = await loginUser(...);
    if (!success) {
        setError(contextError || 'Invalid email or password');  // Use CONTEXT error
    }
};
```

**Problem**: Two error states that could get out of sync
- Local `error` state
- Context `error` state

**Recommendation**: Use only context error or clear local state after API call

---

### Issue 6: No HTTP Error Status Checking in Context ⚠️ MEDIUM
**In Login.jsx:**
```javascript
const success = await loginUser(formData.email, formData.password);
if (success) {
    navigate('/dashboard');
} else {
    setError(contextError || 'Invalid email or password');
}
```

**Problem**: 
- `loginUser()` catches errors and sets context error
- But no HTTP status codes are being checked
- All failures fall back to generic message

**In NutritionContext (line 167):**
```javascript
const loginUser = async (email, password) => {
    try {
        const data = await authAPI.loginUser(email, password);
        // ...
        return true;
    } catch (err) {
        const errorMsg = err.message || 'Invalid email or password';
        setError(errorMsg);
        return false;  // Always returns false - no distinction
    }
};
```

**Recommendation**: Return more granular error info (error code, type, message)

---

## 3. UserDashboard.jsx - Username Display & Profile Fetching

### ✅ Display Name - CORRECT
```javascript
const displayName = userProfile.name || 'User';
```
- Falls back to 'User' if name is missing
- Read from context correctly

### ✅ useEffect Dependencies - CORRECT
- `useNutrition()` provides `userProfile` from context
- No duplicate fetches observed

### Issue 7: Profile May Not Be Fresh on Page Load ⚠️ MEDIUM
**Problem**: 
- Profile is fetched on `userId` change in context (line 70-73)
- But if user navigates back to dashboard, profile fetch is NOT triggered again
- `fetchUserProfile()` uses `userId` only, not checking if data is fresh

```javascript
// In context - only fetches when userId changes
useEffect(() => {
    if (userId) {
        fetchUserProfile();  // Only runs once when userId is set
        fetchTodayMeals();
    }
}, [userId]);
```

**Recommendation**: Add a dependency array or refetch button

---

### Issue 8: Totals Not Displayed in Chart Correctly ⚠️ MEDIUM
**In UserDashboard.jsx (line 25-28):**
```javascript
const calorieData = days.map(day => ({
    day,
    calories: day === todayLabel ? totals.calories : 0,  // Only today's data shown
    target: calorieTarget,
}));
```

**Problem**: 
- Chart ONLY shows TODAY's calories paired with target
- Doesn't show historical weekly data
- User can't see past days' intake

**Backend has**: `/meals/today` endpoint but NO `/meals/week` endpoint
**Recommendation**: Add weekly data fetching or store historical data

---

## 4. DietAnalysis.jsx - Meal Addition & Totals Display

### ✅ Meal Addition Logic - MOSTLY CORRECT
```javascript
const handleAddMeal = () => {
    if (selectedMeal) {
        const food = foodDatabase.find(f => f.name === selectedMeal);
        if (food) {
            addMeal({ 
                time: selectedTime, 
                food: food.name, 
                calories: food.calories, 
                // ... all nutritional values passed
            });
        }
    }
};
```

### Issue 9: addMeal() Not Awaited in Component ⚠️ CRITICAL
**In DietAnalysis.jsx (line 69):**
```javascript
addMeal({ 
    time: selectedTime, 
    food: food.name, 
    // ...
});
setSelectedMeal('');  // Clears immediately
```

**Problem**: 
- `addMeal()` is async but NOT awaited
- Backend saves the meal, returns response
- But component clears form immediately
- If API fails, UI doesn't know

**In NutritionContext (line 368):**
```javascript
const addMeal = async (meal) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals...`, {
            method: 'POST',
            // ...
            body: JSON.stringify(meal)
        });
        // ...
        return true;
    } catch (err) {
        console.error('Error adding meal:', err);
        return false;  // Returned but not checked in component
    }
};
```

**Recommendation**: Await and check result in component:
```javascript
const handleAddMeal = async () => {
    const success = await addMeal({ ... });
    if (success) {
        setSelectedMeal('');
        // Show success toast
    } else {
        // Show error message
    }
};
```

---

### Issue 10: Food Database is Hardcoded in Component ⚠️ MEDIUM
**Problem**: 
- `foodDatabase` array is hardcoded in DietAnalysis.jsx (12 items only)
- Backend has `/api/foods` endpoint to fetch food list
- But frontend doesn't use it

**Impact**: 
- Only 12 foods available to select
- User can't add custom foods
- Food database updates on backend won't reflect in frontend

**Recommendation**: Fetch foods from backend on component mount:
```javascript
useEffect(() => {
    const fetchFoods = async () => {
        const foods = await mealAPI.getAllFoods();  // Add this to api.js
        setFoodDatabase(foods);
    };
    fetchFoods();
}, []);
```

---

### ✅ Totals Display - CORRECT
```javascript
const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + (m.calories || 0),
    // ...properly aggregated
}));
```

---

## 5. Messages.jsx (Chat) - Message Fetching & Sending

### Issue 11: Simulated Doctor Replies Are Not Saved to Backend ⚠️ CRITICAL
**In Messages.jsx (line 22-31):**
```javascript
const handleSendMessage = () => {
    if (newMessage.trim() && currentDoctor) {
        sendMessage(currentDoctor.id, newMessage, true);  // Send user message
        setNewMessage('');
        
        // ❌ SIMULATED REPLY - NOT SENT TO BACKEND
        setTimeout(() => {
            const randomReply = replies[...];
            sendMessage(currentDoctor.id, randomReply, false);  // Simulated as if from doctor
        }, 1500);
    }
};
```

**Problems**:
1. Doctor replies are SIMULATED locally, not from real doctor
2. `sendMessage()` called with `true/false` but signature is `(doctorId, text)`
3. No backend notification to actual doctor about new messages
4. Creates false conversation history

**In NutritionContext (line 273):**
```javascript
const sendMessage = async (doctorId, text) => {  // Only 2 params!
    // ...
    body: JSON.stringify({ text, isFromDoctor: false })  // Hardcoded as false
};
```

**Recommendation**: 
- Remove simulated replies
- Implement real doctor notification (webhook, polling, or WebSocket)
- or Mark simulated messages as "awaiting response"

---

### Issue 12: getMessages Called Without Await in Component ⚠️ CRITICAL
**In Messages.jsx (line 7):**
```javascript
const messages = currentDoctor ? getMessages(currentDoctor.id) : [];
```

**Problem**: 
- `getMessages()` returns a `Promise<Message[]>`, not the actual array
- Assigns Promise to `messages` variable
- Message list won't render

**Should be in useEffect:**
```javascript
useEffect(() => {
    if (currentDoctor) {
        getMessages(currentDoctor.id).then(msgs => setMessages(msgs));
    }
}, [currentDoctor]);
```

---

### Issue 13: Missing useEffect for Loading Initial Messages ⚠️ MEDIUM
**Problem**: When selecting a doctor, messages should auto-load
- Currently relying on `getMessages()` being called in render (which doesn't work)
- No useEffect hook to trigger fetch

**Recommendation**:
```javascript
useEffect(() => {
    if (currentDoctor) {
        getMessages(currentDoctor.id);
    }
}, [currentDoctor]);
```

---

### Issue 14: Message Time Not Formatted ⚠️ LOW
**In Messages.jsx (line 67):**
```javascript
<span className="msg-time">{msg.time}</span>
```

**Problem**: 
- `msg.time` from backend is likely ISO string like "2024-03-28T15:30:00Z"
- Not formatted for human readability
- Shows as: "2024-03-28T15:30:00Z" instead of "3:30 PM"

**Recommendation**: Format with date-fns or moment:
```javascript
<span className="msg-time">{format(new Date(msg.time), 'h:mm a')}</span>
```

---

## 6. Component Data Loading - useEffect Patterns

### Issue 15: No useEffect in DietAnalysis.jsx for Initial Data Load ⚠️ MEDIUM
**Problem**: 
- DietAnalysis uses hardcoded `foodDatabase`
- No useEffect to fetch meals/totals on mount
- Meals and totals depend on context, but no re-fetch trigger

**Should have:**
```javascript
useEffect(() => {
    // Fetch updated foods from backend
    // Refresh meals from context
    // Refresh totals
}, []);
```

---

### Issue 16: useEffect Dependencies Missing in Messages.jsx ⚠️ MEDIUM
**Problem**: If `currentDoctor` changes, messages aren't re-fetched
- No useEffect hook for `currentDoctor` change

---

### Issue 17: UserDashboard useEffect Doesn't Re-fetch on Route Change ⚠️ MEDIUM
**Problem**: 
- `userId` comes from context (set once during login)
- If user navigates away and back, no re-fetch occurs
- Stale data might be displayed

**Recommendation**: Add manual refresh button or re-fetch on mount

---

## 7. Error Handling - Missing Feedback to Users

### Issue 18: API Errors Not Shown in UI ⚠️ CRITICAL
**Affected Components**: 
- UserDashboard: Profile loading errors silently logged
- DietAnalysis: Meal addition errors not shown
- Messages: Message fetch/send errors not shown

**Examples Where Errors Are Lost**:
1. `fetchUserProfile()` catches errors but doesn't update error state
2. `addMeal()` returns false but component doesn't check/show error
3. `sendMessage()` returns false silently
4. `getMessages()` catches errors and logs only

**Impact**: User has no idea when API calls fail

**Recommendation**: Add error boundary and toast notifications:
```javascript
import { useToast } from '@chakra-ui/react';

const { addToast } = useToast();

const handleAddMeal = async () => {
    const success = await addMeal({...});
    if (!success) {
        addToast({
            title: 'Error',
            description: 'Failed to add meal',
            status: 'error'
        });
    }
};
```

---

### Issue 19: HTTP Status Codes Not Handled Properly ⚠️ MEDIUM
**In api.js, the logger shows status but doesn't create actionable responses:**
```javascript
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);  // Generic rejection
    }
);
```

**Better approach:**
```javascript
error => {
    let message = 'An error occurred';
    
    if (error.response?.status === 401) {
        message = 'Session expired, please login again';
        // Clear token and redirect to login
    } else if (error.response?.status === 403) {
        message = 'You do not have permission for this action';
    } else if (error.response?.status === 500) {
        message = 'Server error, please try again later';
    }
    
    const customError = new Error(message);
    customError.status = error.response?.status;
    return Promise.reject(customError);
}
```

---

## 8. Summary Table - Priority Issues

| # | Component | Issue | Severity | Impact |
|---|-----------|-------|----------|--------|
| 1 | NutritionContext | Mixed fetch/axios API calls | ⚠️ CRITICAL | Code maintenance nightmare |
| 2 | Messages.jsx | `getMessages()` not awaited | ⚠️ CRITICAL | Messages never display |
| 9 | DietAnalysis | `addMeal()` not awaited | ⚠️ CRITICAL | No feedback on success/failure |
| 11 | Messages.jsx | Simulated doctor replies | ⚠️ CRITICAL | False conversation history |
| 18 | All | API errors not shown to user | ⚠️ CRITICAL | Silent failures, bad UX |
| 5 | Login/Signup | Error state duplication | ⚠️ MEDIUM | Confusing error handling |
| 10 | DietAnalysis | Hardcoded food database | ⚠️ MEDIUM | Limited food selection |
| 12 | Messages | getMessages not in useEffect | ⚠️ MEDIUM | Won't load on doctor select |
| 3 | NutritionContext | Error not propagated to UI | ⚠️ MEDIUM | Silent failures |
| 7 | UserDashboard | Profile not fresh on navigation | ⚠️ MEDIUM | Stale data |

---

## Recommended Fixes (Priority Order)

1. **Migrate all NutritionContext API calls to use axios** ✅ Consolidates API handling
2. **Fix getMessages() async/await in Messages.jsx** ✅ Makes chat work
3. **Fix addMeal() await in DietAnalysis.jsx** ✅ Provides feedback
4. **Remove simulated replies in Messages.jsx** ✅ Real data flow
5. **Add error boundaries and toast notifications** ✅ User feedback
6. **Fetch food database from backend** ✅ Dynamic content
7. **Add useEffect hooks for data loading** ✅ Proper React patterns
8. **Implement HTTP status code handling in interceptors** ✅ Better error messages
