import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const { users } = useNutrition();
    const [formData, setFormData] = useState({ name: '', email: '', age: '', gender: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e) => { 
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        // Check if user already exists
        const userExists = users.find(u => u.email === formData.email);
        if (userExists) {
            setError('An account with this email already exists');
            return;
        }
        
        // Store signup data in sessionStorage for profile page
        sessionStorage.setItem('signup_data', JSON.stringify(formData));
        navigate('/profile');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-orb orb-a"></div>
                <div className="auth-orb orb-b"></div>
            </div>

            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-brand-content">
                        <Link to="/" className="auth-logo">
                            <div className="logo-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span>Nutri<span className="highlight">Fit</span></span>
                        </Link>
                        <h2>Join NutriFit</h2>
                        <p>Start your journey to balanced nutrition and better health. Create your account in under a minute.</p>
                        <div className="auth-features-list">
                            <div className="auth-feature-item">
                                <div className="afi-icon">🎯</div>
                                <div>
                                    <strong>Personalized Plans</strong>
                                    <span>Tailored to your needs</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">🏃</div>
                                <div>
                                    <strong>Fitness Tracking</strong>
                                    <span>Steps, calories & more</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">👨‍👩‍👧‍👦</div>
                                <div>
                                    <strong>Family Friendly</strong>
                                    <span>Great for kids & teens</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>Create Account</h2>
                            <p>Fill in your details to get started</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        <input type="text" id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                        <input type="email" id="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        <input type="number" id="age" name="age" placeholder="Age" min="5" max="100" value={formData.age} onChange={handleChange} required />
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
                                    <label htmlFor="password">Password</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                        <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange} required />
                                        <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" required />
                                    <span className="checkmark"></span>
                                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                                </label>
                            </div>

                            <button type="submit" className="btn-primary auth-submit">
                                Create Account
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
