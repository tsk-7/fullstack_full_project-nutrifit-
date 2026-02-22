import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import './Auth.css';

const DoctorLogin = () => {
    const navigate = useNavigate();
    const { loginDoctor, registerDoctor, doctorAccounts } = useNutrition();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        specialty: '',
        experience: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isSignup) {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            const doctorExists = doctorAccounts.find(d => d.email === formData.email);
            if (doctorExists) {
                setError('An account with this email already exists');
                return;
            }
            registerDoctor(formData);
            loginDoctor(formData.email, formData.password);
            navigate('/doctor-dashboard');
        } else {
            const success = loginDoctor(formData.email, formData.password);
            if (success) {
                navigate('/doctor-dashboard');
            } else {
                setError('Invalid email or password');
            }
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
                            <div className="logo-icon doctor-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                                </svg>
                            </div>
                            <span>Nutri<span className="highlight">Fit</span></span>
                        </Link>
                        <h2>Doctor Portal</h2>
                        <p>Join our network of nutrition experts and help users achieve their health goals through personalized guidance.</p>
                        <div className="auth-features-list">
                            <div className="auth-feature-item">
                                <div className="afi-icon">👨‍⚕️</div>
                                <div>
                                    <strong>Expert Network</strong>
                                    <span>Connect with patients</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">💬</div>
                                <div>
                                    <strong>Direct Messaging</strong>
                                    <span>Consult with users</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">⭐</div>
                                <div>
                                    <strong>Build Reputation</strong>
                                    <span>Earn ratings & reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>{isSignup ? 'Doctor Registration' : 'Doctor Sign In'}</h2>
                            <p>{isSignup ? 'Create your doctor account' : 'Access your doctor dashboard'}</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            {isSignup && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <div className="input-wrapper">
                                            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            <input type="text" id="name" name="name" placeholder="Dr. John Doe" value={formData.name} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="specialty">Specialty</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                                <select id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} required>
                                                    <option value="">Select Specialty</option>
                                                    <option value="Clinical Nutritionist">Clinical Nutritionist</option>
                                                    <option value="Sports Nutrition">Sports Nutrition</option>
                                                    <option value="Pediatric Nutrition">Pediatric Nutrition</option>
                                                    <option value="Weight Management">Weight Management</option>
                                                    <option value="Diabetic Diet Specialist">Diabetic Diet Specialist</option>
                                                    <option value="General Dietitian">General Dietitian</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="experience">Experience</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                                <input type="text" id="experience" name="experience" placeholder="e.g., 5 years" value={formData.experience} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <input type="email" id="email" name="email" placeholder="doctor@example.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    </button>
                                </div>
                            </div>

                            {isSignup && (
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn-primary auth-submit">
                                {isSignup ? 'Create Account' : 'Sign In'}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button type="button" className="link-btn" onClick={() => setIsSignup(!isSignup)}>
                                {isSignup ? 'Sign In' : 'Register'}
                            </button>
                        </p>
                        <p className="auth-footer-text" style={{ marginTop: '8px' }}>
                            <Link to="/login">← Back to User Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin;
