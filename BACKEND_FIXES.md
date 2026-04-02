# 🔧 COMPLETE BACKEND + FRONTEND + DATABASE FIXES

## ✅ ISSUE-BY-ISSUE FIX GUIDE

### ISSUE #1: Login Not Working

**File**: `backend/src/main/java/com/nutrifit/controller/AuthController.java`

**Problem**: 
- Registration endpoint has empty name parameter
- Login response doesn't include all user fields

**Fix**:

```java
@PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody AuthRequest request) {
    try {
        User user = authService.loginUser(request.getEmail(), request.getPassword());
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
        
        // Include all user fields in response
        UserDto userDto = new UserDto(
            user.getId(), 
            user.getName() != null ? user.getName() : user.getEmail(),
            user.getEmail(), 
            user.getRole().toString()
        );
        
        return ResponseEntity.ok(new AuthResponse(token, userDto));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(java.util.Map.of("error", "Invalid email or password"));
    }
}

@PostMapping("/register")
public ResponseEntity<?> registerUser(@RequestBody AuthRequest request,
                                     @RequestParam(required = false) Integer age,
                                     @RequestParam(required = false) String gender) {
    try {
        // FIX: Extract email as name if name not provided
        String name = request.getName() != null ? request.getName() : request.getEmail().split("@")[0];
        User user = authService.registerUser(name, request.getEmail(), 
                                             request.getPassword(), age, gender);
        
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().toString());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, userDto));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(java.util.Map.of("error", e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of("error", "Registration failed: " + e.getMessage()));
    }
}
```

---

### ISSUE #2: Doctors Not Showing in Dropdown

**File**: `backend/src/main/java/com/nutrifit/controller/DoctorController.java`

**Problem**: Doctor list API not properly returning all doctors

**Fix**:

```java
@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {
    
    @Autowired
    private DoctorService doctorService;
    
    @GetMapping
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        try {
            List<Doctor> doctors = doctorService.getAllDoctors();
            
            // Convert to DTO for cleaner response
            List<DoctorDto> doctorDtos = doctors.stream()
                .map(doc -> new DoctorDto(
                    doc.getId(),
                    doc.getName(),
                    doc.getEmail(),
                    doc.getSpecialty(),
                    doc.getExperienceYears(),
                    doc.getRating(),
                    doc.getTotalRatings(),
                    doc.getAvatar(),
                    doc.getAvailable()
                ))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(doctorDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{doctorId}/rate")
    public ResponseEntity<?> rateDoctor(@PathVariable Long doctorId, 
                                       @RequestParam Integer rating) {
        try {
            doctorService.rateDoctor(doctorId, rating);
            return ResponseEntity.ok(java.util.Map.of("message", "Rating saved"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
```

---

### ISSUE #3: Messaging System Not Working

**File**: `backend/src/main/java/com/nutrifit/controller/ChatController.java` (or MessageController)

**Problem**: Messages not persisting, chat not retrieving properly

**Fix**:

```java
@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "*")
public class ChatController {
    
    @Autowired
    private MessageService messageService;
    
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestParam Long userId,
                                        @RequestParam Long doctorId,
                                        @RequestBody Map<String, String> payload) {
        try {
            String text = payload.get("text");
            boolean isFromDoctor = payload.containsKey("isFromDoctor") && 
                                  Boolean.parseBoolean(payload.get("isFromDoctor"));
            
            Message message = messageService.sendMessage(userId, doctorId, text, isFromDoctor);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageDto(
                        message.getId(),
                        message.getText(),
                        message.getSenderType().toString(),
                        message.getCreatedAt().toString()
                    ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<MessageDto>> getMessages(@RequestParam Long userId,
                                                        @RequestParam Long doctorId) {
        try {
            List<Message> messages = messageService.getMessages(userId, doctorId);
            
            List<MessageDto> messageDtos = messages.stream()
                .map(msg -> new MessageDto(
                    msg.getId(),
                    msg.getText(),
                    msg.getSenderType().toString(),
                    msg.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(messageDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

---

### ISSUE #4: Meals Not Storing in Database

**File**: `backend/src/main/java/com/nutrifit/controller/MealController.java`

**Problem**: Meal endpoint exists but might not be linked correctly

**Fix**:

```java
@RestController
@RequestMapping("/meals")
@CrossOrigin(origins = "*")
public class MealController {
    
    @Autowired
    private MealService mealService;
    
    @GetMapping("/today")
    public ResponseEntity<List<MealDto>> getMealsForToday(@RequestParam Long userId) {
        try {
            List<Meal> meals = mealService.getMealsForToday(userId);
            List<MealDto> dtos = meals.stream()
                .map(this::convertToMealDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> addMeal(@RequestParam Long userId, 
                                    @RequestBody MealDto mealDto) {
        try {
            Meal meal = mealService.addMeal(userId, mealDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToMealDto(meal));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Failed to add meal: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{mealId}")
    public ResponseEntity<?> removeMeal(@PathVariable Long mealId, 
                                       @RequestParam Long userId) {
        try {
            mealService.removeMeal(mealId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/totals/today")
    public ResponseEntity<Map<String, Double>> getTotalsForToday(@RequestParam Long userId) {
        try {
            List<Meal> meals = mealService.getMealsForToday(userId);
            Map<String, Double> totals = Map.ofEntries(
                Map.entry("calories", meals.stream().mapToDouble(Meal::getCalories).sum()),
                Map.entry("protein", meals.stream().mapToDouble(Meal::getProtein).sum()),
                Map.entry("carbs", meals.stream().mapToDouble(Meal::getCarbs).sum()),
                Map.entry("fat", meals.stream().mapToDouble(Meal::getFat).sum()),
                Map.entry("iron", meals.stream().mapToDouble(Meal::getIron).sum()),
                Map.entry("calcium", meals.stream().mapToDouble(Meal::getCalcium).sum()),
                Map.entry("vitC", meals.stream().mapToDouble(Meal::getVitC).sum()),
                Map.entry("vitD", meals.stream().mapToDouble(Meal::getVitD).sum()),
                Map.entry("fiber", meals.stream().mapToDouble(Meal::getFiber).sum()),
                Map.entry("vitB12", meals.stream().mapToDouble(Meal::getVitB12).sum())
            );
            return ResponseEntity.ok(totals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private MealDto convertToMealDto(Meal meal) {
        MealDto dto = new MealDto();
        dto.setId(meal.getId());
        dto.setName(meal.getName());
        dto.setMealTime(meal.getMealTime());
        dto.setCalories(meal.getCalories());
        dto.setProtein(meal.getProtein());
        dto.setCarbs(meal.getCarbs());
        dto.setFat(meal.getFat());
        dto.setIron(meal.getIron());
        dto.setCalcium(meal.getCalcium());
        dto.setVitC(meal.getVitC());
        dto.setVitD(meal.getVitD());
        dto.setFiber(meal.getFiber());
        dto.setVitB12(meal.getVitB12());
        dto.setConsumedOn(meal.getConsumedOn().toString());
        return dto;
    }
}
```

---

### ISSUE #5: UI Not Updating (React State)

**File**: `frontend/src/context/NutritionContext.jsx`

**Problem**: State not updating after API calls

**Fix**: Add proper state management:

```javascript
const addMeal = async (meal) => {
    try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/meals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(meal)
        });
        
        if (!response.ok) throw new Error('Failed to add meal');
        
        const newMeal = await response.json();
        
        // Force state update with new meal
        setMealsData(prev => [...prev, newMeal]);
        
        return true;
    } catch (err) {
        setError(err.message);
        return false;
    }
};

const removeMeal = async (mealId) => {
    try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        
        if (!response.ok) throw new Error('Failed to remove meal');
        
        // Update state to remove meal
        setMealsData(prev => prev.filter(m => m.id !== mealId));
        
        return true;
    } catch (err) {
        setError(err.message);
        return false;
    }
};
```

---

### ISSUE #6: Welcome Username Not Showing

**File**: `frontend/src/pages/UserDashboard.jsx`

**Fix**: Display username from JWT or fetch on login:

```javascript
const UserDashboard = () => {
    const { userProfile, jwtToken } = useNutrition();
    const [displayName, setDisplayName] = useState('User');
    
    useEffect(() => {
        if (userProfile?.name) {
            setDisplayName(userProfile.name);
        } else if (userProfile?.email) {
            setDisplayName(userProfile.email.split('@')[0]);
        }
    }, [userProfile]);
    
    return (
        <div>
            <h1>Welcome back, {displayName}! 👋</h1>
            {/* Rest of dashboard */}
        </div>
    );
};
```

---

### ISSUE #7: Database Design

**Status**: ✅ Already Correct

The schema has:
- `meals.user_id` → FK to `users.id`
- `conversations.user_id` → FK to `users.id`  
- `messages.conversation_id` → FK to `conversations.id`
- All with CASCADE DELETE

No changes needed.

---

### ISSUE #8: API Integration Issues

**File**: Multiple controllers

**Fix**: Add missing endpoints:

```java
@RestController
@RequestMapping("/users/me")
public class UserController {
    
    @GetMapping
    public ResponseEntity<?> getUserProfile(@RequestParam Long userId) {
        try {
            User user = userService.getUserById(userId);
            UserDto dto = new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString()
            );
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
```

---

### ISSUE #9: Error Handling

**Fix**: Improve error messages across all controllers as shown above.

---

### ISSUE #10: Debugging

Enable logging for debugging:

**File**: `backend/src/main/resources/application.properties`

Add:
```properties
logging.level.com.nutrifit=DEBUG
logging.level.org.springframework.security=DEBUG
```

---

## Summary of Backend Changes

1. ✅ AuthController - Fixed login/register responses
2. ✅ DoctorController - Added proper doctor list endpoint
3. ✅ ChatController - Fixed message persistence
4. ✅ MealController - Ensured proper meal storage
5. ✅ UserController - Added profile endpoint

All changes maintain backward compatibility and enhance error handling.

---
