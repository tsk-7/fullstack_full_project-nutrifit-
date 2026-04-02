import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, authAPI } from '../services/api';

const NutritionContext = createContext();

export const useNutrition = () => useContext(NutritionContext);

export const NutritionProvider = ({ children }) => {
    // Get today's date as string for daily tracking
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const getTokenString = (tokenValue) => {
        if (!tokenValue) return null;
        if (typeof tokenValue === 'string') {
            return tokenValue.startsWith('"') ? JSON.parse(tokenValue) : tokenValue;
        }
        return tokenValue;
    };

    const getTokenPayload = (tokenValue) => {
        try {
            const token = getTokenString(tokenValue);
            if (!token) return null;
            const base64Url = token.split('.')[1];
            if (!base64Url) return null;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=');
            return JSON.parse(atob(padded));
        } catch {
            return null;
        }
    };

    const getNormalizedRoleFromToken = (tokenValue) => {
        const payload = getTokenPayload(tokenValue);
        return String(payload?.role || '').toLowerCase();
    };

    const toNumber = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const mapMealForUi = (meal) => ({
        ...meal,
        calories: toNumber(meal?.calories),
        protein: toNumber(meal?.protein),
        carbs: toNumber(meal?.carbs),
        fat: toNumber(meal?.fat),
        iron: toNumber(meal?.iron),
        calcium: toNumber(meal?.calcium),
        vitC: toNumber(meal?.vitC),
        vitD: toNumber(meal?.vitD),
        fiber: toNumber(meal?.fiber),
        vitB12: toNumber(meal?.vitB12),
        food: meal?.name ?? meal?.food ?? '',
        time: meal?.mealTime ?? meal?.time ?? ''
    });

    const mapMessageForUi = (message) => ({
        ...message,
        from: message?.senderType === 'doctor' ? 'doctor' : 'user',
        time: message?.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    });

    // Session state (stored in localStorage)
    const getStorageItem = (key, defaultValue) => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    };

    const [userId, setUserId] = useState(() => getStorageItem('nutrifit_userId', null));
    const [jwtToken, setJwtToken] = useState(() => getStorageItem('nutrifit_token', null));
    const [doctorId, setDoctorId] = useState(() => getStorageItem('nutrifit_doctorId', null));

    // API data state
    const [mealsData, setMealsData] = useState({ date: getTodayDate(), items: [] });
    const meals = mealsData.items || [];
    const [waterGlasses, setWaterGlasses] = useState(0);
    const [userProfile, setUserProfile] = useState({
        id: userId,
        name: '',
        email: '',
        age: '',
        height: '',
        weight: '',
        dateOfBirth: '',
        gender: '',
        profileComplete: false
    });
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [chatMessages, setChatMessages] = useState({});
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [isDoctor, setIsDoctor] = useState(!!doctorId);
    const [loggedInDoctor, setLoggedInDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Save session to localStorage
    useEffect(() => {
        if (userId) localStorage.setItem('nutrifit_userId', JSON.stringify(userId));
        else localStorage.removeItem('nutrifit_userId');
    }, [userId]);

    useEffect(() => {
        if (jwtToken) localStorage.setItem('nutrifit_token', JSON.stringify(jwtToken));
        else localStorage.removeItem('nutrifit_token');
    }, [jwtToken]);

    useEffect(() => {
        if (doctorId) localStorage.setItem('nutrifit_doctorId', JSON.stringify(doctorId));
        else localStorage.removeItem('nutrifit_doctorId');
    }, [doctorId]);

    // Keep session state aligned with JWT role to avoid 403 loops.
    useEffect(() => {
        const role = getNormalizedRoleFromToken(jwtToken);
        if (!role) return;

        if (role === 'doctor') {
            setIsDoctor(true);
            setUserId(null);
        } else {
            setIsDoctor(false);
            setDoctorId(null);
        }
    }, [jwtToken]);

    // Load doctors on app init
    useEffect(() => {
        fetchDoctors();
    }, []);

    // Load user meals and profile when userId changes
    useEffect(() => {
        if (userId && !isDoctor) {
            fetchUserProfile();
            fetchTodayMeals();
            fetchTodayWater();
        }
    }, [userId, isDoctor]);

    // Fetch doctors from backend
    const fetchDoctors = async () => {
        try {
            const token = jwtToken ? (typeof jwtToken === 'string' ? (jwtToken.startsWith('\"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken) : null;
            const response = await fetch(`${API_BASE_URL}/doctors`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to fetch doctors (${response.status})`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid doctors response format');
            setDoctors(data);
        } catch (err) {
            const errorMsg = err.message || 'Failed to load doctors';
            console.error('Error fetching doctors:', errorMsg);
            setError(errorMsg);
        }
    };

    // Fetch user profile from backend
    const fetchUserProfile = async () => {
        if (!userId || !jwtToken) return;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to fetch profile (${response.status})`);
            }
            const data = await response.json();
            if (!data.id) throw new Error('Invalid profile response format');
            setUserProfile(data);
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch profile';
            console.error('Error fetching profile:', errorMsg);
            setError(errorMsg);
        }
    };

    // Fetch today's meals from backend
    const fetchTodayMeals = async () => {
        if (!userId || !jwtToken) return;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/meals/today`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to fetch meals (${response.status})`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid meals response format');
            setMealsData({ date: getTodayDate(), items: data.map(mapMealForUi) });
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch meals';
            console.error('Error fetching meals:', errorMsg);
            setError(errorMsg);
        }
    };

    // Fetch meal totals for today
    const fetchMealTotals = async () => {
        if (!userId || !jwtToken) return null;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('\"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/meals/totals/today`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch totals');
            return await response.json();
        } catch (err) {
            console.error('Error fetching totals:', err);
            return null;
        }
    };

    const fetchTodayWater = async () => {
        if (!userId || !jwtToken) return;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/meals/water/today`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch water logs');
            }
            const data = await response.json();
            setWaterGlasses(Number(data?.glasses || 0));
        } catch (err) {
            console.error('Error fetching water logs:', err);
        }
    };

    const updateWaterGlasses = async (glasses, consumedOn = null) => {
        if (!userId || !jwtToken) return false;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/meals/water`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ glasses, consumedOn })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to update water logs (${response.status})`);
            }

            const data = await response.json();
            setWaterGlasses(Number(data?.glasses || 0));
            setError(null);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to update water logs';
            console.error('Error updating water logs:', errorMsg);
            setError(errorMsg);
            return false;
        }
    };

    const getDailyReport = async (date = null) => {
        if (!userId || !jwtToken) return null;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const query = date ? `?date=${encodeURIComponent(date)}` : '';
            const response = await fetch(`${API_BASE_URL}/meals/report/daily${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to fetch daily report (${response.status})`);
            }
            setError(null);
            return await response.json();
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch daily report';
            console.error('Error fetching daily report:', errorMsg);
            setError(errorMsg);
            return null;
        }
    };

    const getDoctorUserDaywiseReport = async (targetUserId, from = null, to = null) => {
        if (!doctorId || !jwtToken || !targetUserId) return [];
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const params = new URLSearchParams();
            if (from) params.append('from', from);
            if (to) params.append('to', to);
            const query = params.toString() ? `?${params.toString()}` : '';

            const response = await fetch(`${API_BASE_URL}/meals/doctor/user/${targetUserId}/daywise${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to fetch user day-wise report (${response.status})`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch user day-wise report';
            console.error('Error fetching user day-wise report:', errorMsg);
            setError(errorMsg);
            return [];
        }
    };

    // User functions - API calls
    const registerUser = async (name, email, password, age, gender) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authAPI.registerUser(name, email, password, age, gender);
            
            if (!data.token || !data.user || !data.user.id) {
                throw new Error('Invalid registration response format');
            }
            
            // Set user data from response
            const userWithEmail = { ...data.user, email: email };
            setJwtToken(data.token);
            setUserId(data.user.id);
            setUserProfile(userWithEmail);
            setIsDoctor(false);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Registration failed';
            setError(errorMsg);
            console.error('Registration error:', errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authAPI.loginUser(email, password);
            
            if (!data.token || !data.user || !data.user.id) {
                throw new Error('Invalid login response format');
            }
            
            // Set email if name is not available (will be fetched once token is set)
            const userWithEmail = { ...data.user, email: email };
            setJwtToken(data.token);
            setUserId(data.user.id);
            setDoctorId(null);
            setLoggedInDoctor(null);
            setUserProfile(userWithEmail);
            setIsDoctor(false);
            
            // Fetch full profile to get name if not in login response
            setTimeout(() => {
                if (!data.user.name) {
                    fetchUserProfile();
                }
            }, 0);
            
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Invalid email or password';
            setError(errorMsg);
            console.error('Login error:', errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        if (!userId || !jwtToken) return false;
        try {
            setLoading(true);
            setError(null);
            const normalizedPayload = {
                name: profileData?.name?.trim() || null,
                age: profileData?.age === '' || profileData?.age === undefined || profileData?.age === null
                    ? null
                    : Number(profileData.age),
                gender: profileData?.gender?.trim() || null,
                height: profileData?.height === '' || profileData?.height === undefined || profileData?.height === null
                    ? null
                    : Number(profileData.height),
                weight: profileData?.weight === '' || profileData?.weight === undefined || profileData?.weight === null
                    ? null
                    : Number(profileData.weight),
                waist: profileData?.waist === '' || profileData?.waist === undefined || profileData?.waist === null
                    ? null
                    : Number(profileData.waist),
                dateOfBirth: profileData?.dateOfBirth?.trim() || null
            };

            if (
                Number.isNaN(normalizedPayload.age) ||
                Number.isNaN(normalizedPayload.height) ||
                Number.isNaN(normalizedPayload.weight) ||
                Number.isNaN(normalizedPayload.waist)
            ) {
                throw new Error('Please enter valid numeric values for age, height, weight, and waist.');
            }

            if (normalizedPayload.waist === null) {
                throw new Error('Please enter your waist measurement.');
            }

            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(normalizedPayload)
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || errData.error || `Failed to update profile (${response.status})`);
            }
            const data = await response.json();
            if (!data.id) throw new Error('Invalid profile response format');
            setUserProfile(data);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to update profile';
            setError(errorMsg);
            console.error('Profile update error:', errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        setUserId(null);
        setJwtToken(null);
        setDoctorId(null);
        setLoggedInDoctor(null);
        setIsDoctor(false);
        setUserProfile({});
        setMealsData({ date: getTodayDate(), items: [] });
        localStorage.removeItem('nutrifit_userId');
        localStorage.removeItem('nutrifit_doctorId');
        localStorage.removeItem('nutrifit_token');
    };

    // Doctor functions - API calls
    const registerDoctor = async (name, email, password, specialty, experienceYears) => {
        try {
            setLoading(true);
            setError(null);
            const parsedExperience = experienceYears === '' || experienceYears === undefined || experienceYears === null
                ? null
                : Number.parseInt(experienceYears, 10);

            if (parsedExperience !== null && Number.isNaN(parsedExperience)) {
                throw new Error('Experience must be a valid number of years.');
            }

            const data = await authAPI.registerDoctor(name, email, password, specialty, parsedExperience);
            
            if (!data.token || !data.doctor || !data.doctor.id) {
                throw new Error('Invalid doctor registration response format');
            }
            
            setJwtToken(data.token);
            setDoctorId(data.doctor.id);
            setUserId(null);
            setMealsData({ date: getTodayDate(), items: [] });
            setLoggedInDoctor(data.doctor);
            setIsDoctor(true);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Doctor registration failed';
            setError(errorMsg);
            console.error('Doctor registration error:', errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginDoctor = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authAPI.loginDoctor(email, password);
            
            if (!data.token || !data.doctor || !data.doctor.id) {
                throw new Error('Invalid doctor login response format');
            }
            
            setJwtToken(data.token);
            setDoctorId(data.doctor.id);
            setUserId(null);
            setMealsData({ date: getTodayDate(), items: [] });
            setLoggedInDoctor(data.doctor);
            setIsDoctor(true);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Invalid email or password';
            setError(errorMsg);
            console.error('Doctor login error:', errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logoutDoctor = () => {
        setDoctorId(null);
        setJwtToken(null);
        setUserId(null);
        setLoggedInDoctor(null);
        setIsDoctor(false);
        setMealsData({ date: getTodayDate(), items: [] });
        localStorage.removeItem('nutrifit_userId');
        localStorage.removeItem('nutrifit_doctorId');
        localStorage.removeItem('nutrifit_token');
    };

    // Message functions - API calls
    const sendMessage = async (doctorId, text) => {
        if (!userId || !jwtToken) return false;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ doctorId, text })
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to send message (${response.status})`);
            }
            const newMessage = mapMessageForUi(await response.json());
            if (!newMessage.id) throw new Error('Invalid message response format');
            const messageKey = `user_${userId}_doctor_${doctorId}`;
            setChatMessages(prev => ({
                ...prev,
                [messageKey]: [...(prev[messageKey] || []), newMessage]
            }));
            setError(null);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to send message';
            console.error('Error sending message:', errorMsg);
            setError(errorMsg);
            return false;
        }
    };

    const sendDoctorMessage = async (doctorId, targetUserId, text) => {
        if (!doctorId || !targetUserId || !jwtToken) return false;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: Number(targetUserId), text })
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to send message (${response.status})`);
            }
            const newMessage = mapMessageForUi(await response.json());
            const messageKey = `user_${targetUserId}_doctor_${doctorId}`;
            setChatMessages(prev => ({
                ...prev,
                [messageKey]: [...(prev[messageKey] || []), newMessage]
            }));
            setError(null);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to send message';
            console.error('Error sending doctor message:', errorMsg);
            setError(errorMsg);
            return false;
        }
    };

    const rateMessage = async (doctorId, messageId, rating, feedback) => {
        if (!userId || !jwtToken) return false;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/messages/${messageId}/rate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, feedback })
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to rate message (${response.status})`);
            }
            // Update local state
            const messageKey = `user_${userId}_doctor_${doctorId}`;
            setChatMessages(prev => ({
                ...prev,
                [messageKey]: prev[messageKey]?.map(msg => 
                    msg.id === messageId ? { ...msg, rated: true, rating, feedback } : msg
                ) || []
            }));
            // Refresh doctors list to get updated rating
            await fetchDoctors();
            setError(null);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to rate message';
            console.error('Error rating message:', errorMsg);
            setError(errorMsg);
            return false;
        }
    };

    const getMessages = async (doctorId) => {
        if (!userId || !jwtToken) return [];
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/messages/conversation/${doctorId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to fetch messages (${response.status})`);
            }
            const rawMessages = await response.json();
            if (!Array.isArray(rawMessages)) throw new Error('Invalid messages response format');
            const messages = rawMessages.map(mapMessageForUi);
            const messageKey = `user_${userId}_doctor_${doctorId}`;
            setChatMessages(prev => ({ ...prev, [messageKey]: messages }));
            setError(null);
            return messages;
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch messages';
            console.error('Error fetching messages:', errorMsg);
            setError(errorMsg);
            return [];
        }
    };

    const getDoctorInbox = async () => {
        if (!doctorId || !jwtToken) return [];
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/messages/doctor/inbox`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to fetch inbox (${response.status})`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid inbox response format');
            setError(null);
            return data;
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch inbox';
            console.error('Error fetching doctor inbox:', errorMsg);
            setError(errorMsg);
            return [];
        }
    };

    const getDoctorConversation = async (targetUserId) => {
        if (!doctorId || !targetUserId || !jwtToken) return [];
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/messages/doctor/conversation/${targetUserId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to fetch conversation (${response.status})`);
            }
            const messages = await response.json();
            if (!Array.isArray(messages)) throw new Error('Invalid conversation response format');
            const mappedMessages = messages.map(mapMessageForUi);
            const messageKey = `user_${targetUserId}_doctor_${doctorId}`;
            setChatMessages(prev => ({ ...prev, [messageKey]: mappedMessages }));
            setError(null);
            return mappedMessages;
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch conversation';
            console.error('Error fetching doctor conversation:', errorMsg);
            setError(errorMsg);
            return [];
        }
    };

    // Meal functions - API calls
    const addMeal = async (meal) => {
        if (!userId || !jwtToken) return false;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/meals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(meal)
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to add meal (${response.status})`);
            }
            const newMeal = mapMealForUi(await response.json());
            if (!newMeal.id) throw new Error('Invalid meal response format');
            setMealsData(prev => ({
                ...prev,
                items: [...prev.items, newMeal]
            }));
            setError(null);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to add meal';
            console.error('Error adding meal:', errorMsg);
            setError(errorMsg);
            return false;
        }
    };

    const removeMeal = async (mealId) => {
        if (!userId || !jwtToken) return false;
        try {
            const token = typeof jwtToken === 'string' ? (jwtToken.startsWith('"') ? JSON.parse(jwtToken) : jwtToken) : jwtToken;
            const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to remove meal (${response.status})`);
            }
            setMealsData(prev => ({
                ...prev,
                items: prev.items.filter(m => m.id !== mealId)
            }));
            setError(null);
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to remove meal';
            console.error('Error removing meal:', errorMsg);
            setError(errorMsg);
            return false;
        }
    };

    const clearMeals = async () => {
        if (!userId) return false;
        try {
            // Fetch all meals first
            const allMeals = mealsData.items;
            // Delete each meal
            for (const meal of allMeals) {
                await removeMeal(meal.id);
            }
            setMealsData({ date: getTodayDate(), items: [] });
            return true;
        } catch (err) {
            console.error('Error clearing meals:', err);
            return false;
        }
    };

    const totals = meals.reduce((acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
        iron: acc.iron + (m.iron || 0),
        calcium: acc.calcium + (m.calcium || 0),
        vitC: acc.vitC + (m.vitC || 0),
        vitD: acc.vitD + (m.vitD || 0),
        fiber: acc.fiber + (m.fiber || 0),
        vitB12: acc.vitB12 + (m.vitB12 || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, calcium: 0, vitC: 0, vitD: 0, fiber: 0, vitB12: 0 });

    const getSortedDoctors = () => {
        return [...doctors].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    };

    return (
        <NutritionContext.Provider value={{ 
            meals, addMeal, removeMeal, clearMeals, totals, waterGlasses, updateWaterGlasses,
            userProfile, updateProfile, registerUser, loginUser, users, logoutUser,
            doctors, getSortedDoctors, currentDoctor, setCurrentDoctor,
            registerDoctor, loginDoctor, logoutDoctor, isDoctor, loggedInDoctor,
            chatMessages, sendMessage, sendDoctorMessage, rateMessage, getMessages, getDoctorInbox, getDoctorConversation,
            userId, jwtToken, doctorId, loading, error, fetchMealTotals, getDailyReport, getDoctorUserDaywiseReport
        }}>
            {children}
        </NutritionContext.Provider>
    );
};
