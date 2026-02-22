import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser, users } = useNutrition();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e) => { 
        e.preventDefault();
        setError('');
        
        // Check if user exists
        const userExists = users.find(u => u.email === formData.email);
        if (!userExists) {
            setError('No account found with this email. Please sign up first.');
            return;
        }
        
        const success = loginUser(formData.email, formData.password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid email or password');
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
                        <h2>Welcome Back</h2>
                        <p>Track your nutrition, monitor fitness, and discover personalized diet plans for a healthier you.</p>
                        <div className="auth-features-list">
                            <div className="auth-feature-item">
                                <div className="afi-icon">🥗</div>
                                <div>
                                    <strong>Smart Diet Analysis</strong>
                                    <span>Real-time nutrient breakdowns</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">📊</div>
                                <div>
                                    <strong>Progress Dashboards</strong>
                                    <span>Visual health analytics</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">💬</div>
                                <div>
                                    <strong>Expert Guidance</strong>
                                    <span>Direct messaging with nutritionists</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <input type="email" id="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="label-row">
                                    <label htmlFor="password">Password</label>
                                    <a href="#" className="forgot-link">Forgot password?</a>
                                </div>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
                                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Remember me for 30 days
                                </label>
                            </div>

                            <button type="submit" className="btn-primary auth-submit">
                                Sign In
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <div className="social-auth">
                            <button className="social-auth-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Google
                            </button>
                        </div>

                        <p className="auth-footer-text">
                            Don't have an account? <Link to="/signup">Create free account</Link>
                        </p>
                        <div className="auth-footer-links">
                            <Link to="/doctor-login">Doctor Login</Link>
                            <span>•</span>
                            <Link to="/admin-login">Admin Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
