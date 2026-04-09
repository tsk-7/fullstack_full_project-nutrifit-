import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ variant = 'landing' }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${variant}`}>
            <div className="navbar-inner container">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="logo-text">Nutri<span className="logo-highlight">Fit</span></span>
                </Link>

                <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    {variant === 'landing' && (
                        <>
                            <a href="#features" className="nav-link" onClick={() => setMobileOpen(false)}>Features</a>
                            <a href="#how-it-works" className="nav-link" onClick={() => setMobileOpen(false)}>How It Works</a>
                            <a href="#testimonials" className="nav-link" onClick={() => setMobileOpen(false)}>Testimonials</a>
                            <a href="#pricing" className="nav-link" onClick={() => setMobileOpen(false)}>Pricing</a>
                        </>
                    )}
                    {variant === 'user' && (
                        <>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                                Dashboard
                            </Link>
                            <Link to="/diet-analysis" className={`nav-link ${isActive('/diet-analysis') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
                                Diet Analysis
                            </Link>
                            <Link to="/fitness" className={`nav-link ${isActive('/fitness') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                Fitness
                            </Link>
                            <Link to="/messages" className={`nav-link ${isActive('/messages') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                Messages
                            </Link>
                        </>
                    )}
                    {variant === 'admin' && (
                        <>
                            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                                Dashboard
                            </Link>
                            <Link to="/admin/food-management" className={`nav-link ${isActive('/admin/food-management') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /></svg>
                                Food & Diet
                            </Link>
                            <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                Users
                            </Link>
                            <Link to="/admin/messages" className={`nav-link ${isActive('/admin/messages') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                Messages
                            </Link>
                        </>
                    )}
                    {variant === 'doctor' && (
                        <>
                            <Link to="/doctor-dashboard" className={`nav-link ${isActive('/doctor-dashboard') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                                Dashboard
                            </Link>
                            <Link to="/doctor-messages" className={`nav-link ${isActive('/doctor-messages') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                Messages
                            </Link>
                        </>
                    )}
                </div>

                <div className="navbar-actions">
                    {variant === 'landing' && (
                        <>
                            <Link to="/login" className="btn-secondary btn-sm">Log In</Link>
                            <Link to="/signup" className="btn-primary btn-sm">Get Started</Link>
                        </>
                    )}
                    {(variant === 'user' || variant === 'admin' || variant === 'doctor') && (
                        <div className="user-menu">
                            <div className="user-avatar">
                                {variant === 'admin' ? 'A' : variant === 'doctor' ? 'D' : 'U'}
                            </div>
                            <Link to="/" className="btn-secondary btn-sm">Logout</Link>
                        </div>
                    )}
                </div>

                <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                    <span className={`hamburger ${mobileOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
