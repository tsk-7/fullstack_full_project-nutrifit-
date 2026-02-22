import { createContext, useContext, useState, useEffect } from 'react';

const NutritionContext = createContext();

export const useNutrition = () => useContext(NutritionContext);

// Initial doctors data
const initialDoctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Clinical Nutritionist', experience: '12 years', rating: 4.8, totalRatings: 156, avatar: 'SJ', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Sports Nutrition', experience: '8 years', rating: 4.6, totalRatings: 98, avatar: 'MC', available: true },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatric Nutrition', experience: '10 years', rating: 4.9, totalRatings: 203, avatar: 'ED', available: true },
    { id: 4, name: 'Dr. Robert Wilson', specialty: 'Weight Management', experience: '15 years', rating: 4.7, totalRatings: 178, avatar: 'RW', available: false },
    { id: 5, name: 'Dr. Amanda Lee', specialty: 'Diabetic Diet Specialist', experience: '9 years', rating: 4.5, totalRatings: 87, avatar: 'AL', available: true },
];

export const NutritionProvider = ({ children }) => {
    // Load from localStorage on init
    const loadFromStorage = (key, defaultValue) => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    };

    // Get today's date as string for daily tracking
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    // Load meals with daily reset check
    const loadMealsWithDailyReset = () => {
        const storedMeals = loadFromStorage('nutrifit_meals', { date: getTodayDate(), items: [] });
        // Reset if it's a new day
        if (storedMeals.date !== getTodayDate()) {
            return { date: getTodayDate(), items: [] };
        }
        return storedMeals;
    };

    const [mealsData, setMealsData] = useState(() => loadMealsWithDailyReset());
    const meals = mealsData.items || [];
    const [userProfile, setUserProfile] = useState(() => loadFromStorage('nutrifit_profile', {
        name: '',
        email: '',
        age: '',
        height: '',
        weight: '',
        dateOfBirth: '',
        gender: '',
        isProfileComplete: false
    }));
    const [users, setUsers] = useState(() => loadFromStorage('nutrifit_users', []));
    const [doctors, setDoctors] = useState(() => loadFromStorage('nutrifit_doctors', initialDoctors));
    const [doctorAccounts, setDoctorAccounts] = useState(() => loadFromStorage('nutrifit_doctor_accounts', []));
    const [chatMessages, setChatMessages] = useState(() => loadFromStorage('nutrifit_messages', {}));
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [isDoctor, setIsDoctor] = useState(() => loadFromStorage('nutrifit_is_doctor', false));
    const [loggedInDoctor, setLoggedInDoctor] = useState(() => loadFromStorage('nutrifit_logged_doctor', null));

    // Check for daily reset on component mount and periodically
    useEffect(() => {
        const checkDailyReset = () => {
            if (mealsData.date !== getTodayDate()) {
                setMealsData({ date: getTodayDate(), items: [] });
            }
        };
        checkDailyReset();
        const interval = setInterval(checkDailyReset, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [mealsData.date]);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('nutrifit_meals', JSON.stringify(mealsData));
    }, [mealsData]);

    useEffect(() => {
        localStorage.setItem('nutrifit_profile', JSON.stringify(userProfile));
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem('nutrifit_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('nutrifit_doctors', JSON.stringify(doctors));
    }, [doctors]);

    useEffect(() => {
        localStorage.setItem('nutrifit_doctor_accounts', JSON.stringify(doctorAccounts));
    }, [doctorAccounts]);

    useEffect(() => {
        localStorage.setItem('nutrifit_messages', JSON.stringify(chatMessages));
    }, [chatMessages]);

    useEffect(() => {
        localStorage.setItem('nutrifit_is_doctor', JSON.stringify(isDoctor));
    }, [isDoctor]);

    useEffect(() => {
        localStorage.setItem('nutrifit_logged_doctor', JSON.stringify(loggedInDoctor));
    }, [loggedInDoctor]);

    // User functions
    const registerUser = (userData) => {
        const newUser = { ...userData, id: Date.now(), createdAt: new Date().toISOString() };
        setUsers(prev => [...prev, newUser]);
        return newUser;
    };

    const loginUser = (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setUserProfile({ ...user, isProfileComplete: true });
            setIsDoctor(false);
            return true;
        }
        return false;
    };

    const updateProfile = (profileData) => {
        const updatedProfile = { ...profileData, isProfileComplete: true };
        setUserProfile(updatedProfile);
        setUsers(prev => {
            const existingIndex = prev.findIndex(u => u.email === profileData.email);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], ...profileData };
                return updated;
            }
            return [...prev, { ...profileData, id: Date.now(), createdAt: new Date().toISOString() }];
        });
    };

    // Doctor functions
    const registerDoctor = (doctorData) => {
        const newDoctor = { 
            ...doctorData, 
            id: Date.now(), 
            rating: 0, 
            totalRatings: 0, 
            avatar: doctorData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            available: true,
            createdAt: new Date().toISOString() 
        };
        setDoctorAccounts(prev => [...prev, newDoctor]);
        setDoctors(prev => [...prev, newDoctor]);
        return newDoctor;
    };

    const loginDoctor = (email, password) => {
        const doctor = doctorAccounts.find(d => d.email === email && d.password === password);
        if (doctor) {
            setLoggedInDoctor(doctor);
            setIsDoctor(true);
            return true;
        }
        return false;
    };

    const logoutDoctor = () => {
        setLoggedInDoctor(null);
        setIsDoctor(false);
    };

    // Message functions
    const sendMessage = (doctorId, text, fromUser = true) => {
        const messageKey = `user_${userProfile.email || 'guest'}_doctor_${doctorId}`;
        const newMessage = {
            id: Date.now(),
            text,
            from: fromUser ? 'user' : 'doctor',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: 'Today',
            rated: false,
            rating: 0,
            feedback: ''
        };
        setChatMessages(prev => ({
            ...prev,
            [messageKey]: [...(prev[messageKey] || []), newMessage]
        }));
    };

    // Doctor sends message to user
    const sendDoctorMessage = (doctorId, userEmail, text) => {
        const messageKey = `user_${userEmail}_doctor_${doctorId}`;
        const newMessage = {
            id: Date.now(),
            text,
            from: 'doctor',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: 'Today',
            rated: false,
            rating: 0,
            feedback: ''
        };
        setChatMessages(prev => ({
            ...prev,
            [messageKey]: [...(prev[messageKey] || []), newMessage]
        }));
    };

    const rateMessage = (doctorId, messageId, rating, feedback) => {
        const messageKey = `user_${userProfile.email || 'guest'}_doctor_${doctorId}`;
        setChatMessages(prev => ({
            ...prev,
            [messageKey]: prev[messageKey].map(msg => 
                msg.id === messageId ? { ...msg, rated: true, rating, feedback } : msg
            )
        }));
        setDoctors(prev => prev.map(doc => {
            if (doc.id === doctorId) {
                const newTotalRatings = doc.totalRatings + 1;
                const newRating = ((doc.rating * doc.totalRatings) + rating) / newTotalRatings;
                return { ...doc, rating: Math.round(newRating * 10) / 10, totalRatings: newTotalRatings };
            }
            return doc;
        }));
    };

    const getMessages = (doctorId) => {
        const messageKey = `user_${userProfile.email || 'guest'}_doctor_${doctorId}`;
        return chatMessages[messageKey] || [];
    };

    // Meal functions
    const addMeal = (meal) => {
        setMealsData(prev => ({
            ...prev,
            items: [...prev.items, { ...meal, id: Date.now() }]
        }));
    };

    const removeMeal = (id) => {
        setMealsData(prev => ({
            ...prev,
            items: prev.items.filter(m => m.id !== id)
        }));
    };

    const clearMeals = () => {
        setMealsData({ date: getTodayDate(), items: [] });
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

    const waterGlasses = 0;

    const getSortedDoctors = () => {
        return [...doctors].sort((a, b) => b.rating - a.rating);
    };

    return (
        <NutritionContext.Provider value={{ 
            meals, addMeal, removeMeal, clearMeals, totals, waterGlasses, 
            userProfile, updateProfile, registerUser, loginUser, users,
            doctors, getSortedDoctors, currentDoctor, setCurrentDoctor,
            registerDoctor, loginDoctor, logoutDoctor, isDoctor, loggedInDoctor, doctorAccounts,
            chatMessages, sendMessage, sendDoctorMessage, rateMessage, getMessages
        }}>
            {children}
        </NutritionContext.Provider>
    );
};
