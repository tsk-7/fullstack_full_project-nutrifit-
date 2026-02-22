import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import './Auth.css';

const Profile = () => {
    const navigate = useNavigate();
    const { updateProfile, registerUser } = useNutrition();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        height: '',
        weight: '',
        dateOfBirth: '',
        gender: ''
    });

    useEffect(() => {
        // Load signup data from sessionStorage
        const signupData = sessionStorage.getItem('signup_data');
        if (signupData) {
            const parsed = JSON.parse(signupData);
            setFormData(prev => ({
                ...prev,
                name: parsed.name || '',
                email: parsed.email || '',
                password: parsed.password || '',
                age: parsed.age || '',
                gender: parsed.gender || ''
            }));
        }
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Register user with all data
        registerUser(formData);
        updateProfile(formData);
        // Clear signup data
        sessionStorage.removeItem('signup_data');
        navigate('/dashboard');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-orb orb-a"></div>
                <div className="auth-orb orb-b"></div>
            </div>

            <div className="auth-container profile-container">
                <div className="auth-left">
                    <div className="auth-brand-content">
                        <div className="auth-logo">
                            <div className="logo-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span>Nutri<span className="highlight">Fit</span></span>
                        </div>
                        <h2>Complete Your Profile</h2>
                        <p>Help us personalize your nutrition and fitness journey by providing some basic information about yourself.</p>
                        <div className="auth-features-list">
                            <div className="auth-feature-item">
                                <div className="afi-icon">📊</div>
                                <div>
                                    <strong>BMI Calculation</strong>
                                    <span>Based on your height & weight</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">🎯</div>
                                <div>
                                    <strong>Personalized Goals</strong>
                                    <span>Tailored to your profile</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">🍎</div>
                                <div>
                                    <strong>Custom Diet Plans</strong>
                                    <span>Age & gender specific</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>Your Details</h2>
                            <p>Fill in your information to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        <input type="text" id="name" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                        <input type="number" id="age" name="age" placeholder="Your age" min="5" max="120" value={formData.age} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="height">Height (cm)</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
                                        <input type="number" id="height" name="height" placeholder="e.g., 170" min="50" max="250" value={formData.height} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="weight">Weight (kg)</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                        <input type="number" id="weight" name="weight" placeholder="e.g., 65" min="10" max="300" value={formData.weight} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary auth-submit">
                                Complete Profile
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
