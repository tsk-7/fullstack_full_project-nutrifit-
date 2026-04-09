import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const { registerUser, loading, error: contextError } = useNutrition();
    const [formData, setFormData] = useState({ name: '', email: '', age: '', gender: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const validateField = (name, value, snapshot = formData) => {
        const v = String(value ?? '').trim();
        if (name === 'name') {
            if (!v) return 'Name is required';
            if (v.length < 2) return 'Name must be at least 2 characters';
        }
        if (name === 'email') {
            if (!v) return 'Email is required';
            if (!/^\S+@\S+\.\S+$/.test(v)) return 'Enter a valid email address';
        }
        if (name === 'age') {
            const age = Number(value);
            if (!value) return 'Age is required';
            if (!Number.isFinite(age) || age < 5 || age > 100) return 'Age must be between 5 and 100';
        }
        if (name === 'gender' && !v) return 'Gender is required';
        if (name === 'password') {
            if (!value) return 'Password is required';
            if (String(value).length < 8) return 'Password must be at least 8 characters';
        }
        if (name === 'confirmPassword') {
            if (!value) return 'Confirm your password';
            if (value !== snapshot.password) return 'Passwords do not match';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nextForm = { ...formData, [name]: value };
        setFormData(nextForm);
        setFieldErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value, nextForm),
            ...(name === 'password' || name === 'confirmPassword'
                ? { confirmPassword: validateField('confirmPassword', nextForm.confirmPassword, nextForm) }
                : {})
        }));
    };
    
    const handleSubmit = async (e) => { 
        e.preventDefault();
        setError('');
        
        const nextErrors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            age: validateField('age', formData.age),
            gender: validateField('gender', formData.gender),
            password: validateField('password', formData.password),
            confirmPassword: validateField('confirmPassword', formData.confirmPassword)
        };
        setFieldErrors(nextErrors);

        const hasErrors = Object.values(nextErrors).some(Boolean);
        if (hasErrors) {
            setError('Please fix the highlighted fields.');
            return;
        }

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const age = formData.age === '' ? '' : Number(formData.age);
        const gender = formData.gender.trim();
        const password = formData.password;
        
        // Store signup data in sessionStorage for profile page
        sessionStorage.setItem('signup_data', JSON.stringify({
            name,
            email,
            age,
            gender
        }));
        
        // Call registerUser with all required parameters including name
        const success = await registerUser(name, email, password, age, gender);
        if (success) {
            navigate('/profile');
        } else {
            setError(contextError || 'Registration failed');
        }
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
                                        <input type="text" id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} autocomplete="name" required />
                                    </div>
                                    {fieldErrors.name && <small className="field-error">{fieldErrors.name}</small>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                        <input type="email" id="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autocomplete="email" required />
                                    </div>
                                    {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        <input type="number" id="age" name="age" placeholder="Age" min="5" max="100" value={formData.age} onChange={handleChange} autocomplete="off" required />
                                    </div>
                                    {fieldErrors.age && <small className="field-error">{fieldErrors.age}</small>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} autocomplete="sex" required>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    {fieldErrors.gender && <small className="field-error">{fieldErrors.gender}</small>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                        <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange} autocomplete="new-password" required />
                                        <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </button>
                                    </div>
                                    {fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} autocomplete="new-password" required />
                                    </div>
                                    {fieldErrors.confirmPassword && <small className="field-error">{fieldErrors.confirmPassword}</small>}
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
