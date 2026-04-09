import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor to include JWT token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('nutrifit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // User Registration
  registerUser: async (name, email, password, age, gender) => {
    try {
      const normalizedName = String(name || '').trim();
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const normalizedAge = age === '' || age === undefined || age === null ? null : Number.parseInt(age, 10);
      const normalizedGender = String(gender || '').trim();

      if (!normalizedName || !normalizedEmail || !password) {
        throw new Error('Name, email, and password are required.');
      }

      if (normalizedAge !== null && Number.isNaN(normalizedAge)) {
        throw new Error('Age must be a valid number.');
      }

      console.log('📤 Registering user...', { name: normalizedName, email: normalizedEmail, age: normalizedAge, gender: normalizedGender });
      
      const response = await axiosInstance.post(`/auth/register`, 
        { name: normalizedName, email: normalizedEmail, password, age: normalizedAge, gender: normalizedGender }
      );
      
      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        // Backend returned an error response
        const status = error.response.status;
        const data = error.response.data;
        
        if (data?.message || data?.error) {
          errorMessage = data.message || data.error;
        } else if (status === 409) {
          errorMessage = 'This email is already registered';
        } else if (status === 400) {
          errorMessage = 'Invalid email or password format';
        } else if (status === 500) {
          errorMessage = 'Server error - please try again later';
        }
        
        console.error(`HTTP ${status}:`, errorMessage);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server - check if backend is running';
        console.error('No response received:', error.request);
      } else {
        // Error in request setup
        errorMessage = error.message;
        console.error('Request error:', error.message);
      }
      
      throw new Error(errorMessage);
    }
  },

  // User Login
  loginUser: async (email, password) => {
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      console.log('📤 Logging in user...', { email: normalizedEmail });
      
      const response = await axiosInstance.post('/auth/login', 
        { email: normalizedEmail, password }
      );
      
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
  },

  // Doctor Registration
  registerDoctor: async (name, email, password, specialty, experienceYears) => {
    try {
      console.log('📤 Registering doctor...', { name, email, specialty, experienceYears });
      
      const response = await axiosInstance.post(`/auth/doctor-register`, 
        { name, email, password, specialty, experienceYears }
      );
      
      console.log('✅ Doctor registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Doctor registration failed:', error);
      
      let errorMessage = 'Doctor registration failed';
      
      if (error.response?.data?.message || error.response?.data?.error) {
        errorMessage = error.response.data.message || error.response.data.error;
      } else if (error.response?.status === 409) {
        errorMessage = 'This email is already registered';
      }
      
      throw new Error(errorMessage);
    }
  },

  // Doctor Login
  loginDoctor: async (email, password) => {
    try {
      console.log('📤 Logging in doctor...', { email });
      
      const response = await axiosInstance.post('/auth/doctor-login', 
        { email, password }
      );
      
      console.log('✅ Doctor login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Doctor login failed:', error);
      
      let errorMessage = 'Doctor login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.data?.message || error.response?.data?.error) {
        errorMessage = error.response.data.message || error.response.data.error;
      }
      
      throw new Error(errorMessage);
    }
  }
};

// User API calls
export const userAPI = {
  // Get current user profile
  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw new Error('Failed to fetch profile: ' + (error.response?.data?.message || error.response?.data?.error || error.message));
    }
  },

  // Update user profile
  updateProfile: async (userIdOrProfileData, maybeProfileData) => {
    try {
      const profileData = maybeProfileData ?? userIdOrProfileData;
      const response = await axiosInstance.put('/users/me/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Failed to update profile: ' + (error.response?.data?.message || error.response?.data?.error || error.message));
    }
  }
};

// Doctor API calls
export const doctorAPI = {
  // Get all doctors
  getAllDoctors: async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw new Error('Failed to fetch doctors');
    }
  }
};

// Meal API calls
export const mealAPI = {
  // Get today's meals
  getTodayMeals: async (userId) => {
    try {
      const response = await axiosInstance.get(`/meals/today?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      throw new Error('Failed to fetch meals');
    }
  },

  // Add meal
  addMeal: async (userId, mealData) => {
    try {
      const response = await axiosInstance.post(`/meals?userId=${userId}`, mealData);
      return response.data;
    } catch (error) {
      console.error('Failed to add meal:', error);
      throw new Error('Failed to add meal: ' + (error.response?.data?.error || error.message));
    }
  }
};

// Food API calls
export const foodAPI = {
  getAllFoods: async () => {
    try {
      const response = await axiosInstance.get('/foods');
      const rows = Array.isArray(response.data) ? response.data : [];
      return rows.map((food) => ({
        ...food,
        dietType: food.dietType ?? food.diet_type ?? 'veg',
        vitC: food.vitC ?? food.vit_c ?? 0,
        vitD: food.vitD ?? food.vit_d ?? 0,
        vitB12: food.vitB12 ?? food.vit_b12 ?? 0
      }));
    } catch (error) {
      console.error('Failed to fetch foods:', error);
      throw new Error('Failed to fetch foods');
    }
  },

  createFood: async (foodData) => {
    try {
      const response = await axiosInstance.post('/foods', foodData);
      return response.data;
    } catch (error) {
      console.error('Failed to create food:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create food');
    }
  },

  updateFood: async (foodId, foodData) => {
    try {
      const response = await axiosInstance.put(`/foods/${foodId}`, foodData);
      return response.data;
    } catch (error) {
      console.error('Failed to update food:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update food');
    }
  },

  deleteFood: async (foodId) => {
    try {
      const response = await axiosInstance.delete(`/foods/${foodId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete food:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete food');
    }
  }
};

export default axiosInstance;
