import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import './Auth.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { loginUser, loading } = useNutrition();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const email = String(formData.email || '').trim().toLowerCase();
        const password = String(formData.password || '').trim();

        if (!email || !password) {
            setError('Please enter admin email and password.');
            return;
        }

        const success = await loginUser(email, password);
        if (!success) {
            setError('Invalid admin credentials. Use tharun@nutrifit.com / admin123.');
            return;
        }

        navigate('/admin');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-orb orb-a" style={{ background: 'rgba(139, 92, 246, 0.12)' }}></div>
                <div className="auth-orb orb-b" style={{ background: 'rgba(6, 182, 212, 0.1)' }}></div>
            </div>

            <div className="auth-container">
                <div className="auth-left admin-left">
                    <div className="auth-brand-content">
                        <Link to="/" className="auth-logo">
                            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span>Nutri<span className="highlight">Fit</span> <span className="admin-tag">Admin</span></span>
                        </Link>
                        <h2>Admin Portal</h2>
                        <p>Manage users, nutritional data, diet plans, and respond to user queries through the admin dashboard.</p>
                        <div className="auth-features-list">
                            <div className="auth-feature-item">
                                <div className="afi-icon">🛡️</div>
                                <div>
                                    <strong>User Management</strong>
                                    <span>Monitor health records</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">🍽️</div>
                                <div>
                                    <strong>Food Database</strong>
                                    <span>Add & update food items</span>
                                </div>
                            </div>
                            <div className="auth-feature-item">
                                <div className="afi-icon">📋</div>
                                <div>
                                    <strong>Diet Plans</strong>
                                    <span>Create custom diet plans</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <div className="admin-badge-header">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                Admin Access
                            </div>
                            <h2>Admin Sign In</h2>
                            <p>Enter your admin credentials</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Admin Email</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <input type="email" id="email" name="email" placeholder="tharun@nutrifit.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Enter admin password" value={formData.password} onChange={handleChange} required />
                                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary auth-submit" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }} disabled={loading}>
                                Access Admin Panel
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            <Link to="/login">← Back to User Login</Link>
                        </p>
                        <p className="auth-footer-text" style={{ marginTop: '8px', color: '#64748b' }}>
                            Demo admin: tharun@nutrifit.com / admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
