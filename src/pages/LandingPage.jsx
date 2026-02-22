import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LandingPage.css';

const LandingPage = () => {
    const features = [
        { icon: '🥗', title: 'Smart Diet Analysis', desc: 'Log your meals and get instant nutrient breakdowns including proteins, vitamins, iron, calcium and more.' },
        { icon: '⚡', title: 'Deficiency Detection', desc: 'Our intelligent system detects nutrient gaps and provides actionable recommendations for balanced nutrition.' },
        { icon: '🏃', title: 'Fitness Tracking', desc: 'Track daily steps, calories burned, and monitor your physical activity with beautiful progress charts.' },
        { icon: '📊', title: 'BMI Calculator', desc: 'Calculate and track your Body Mass Index over time with personalized health insights.' },
        { icon: '🍎', title: 'Personalized Plans', desc: 'Receive AI-powered diet plans tailored to your nutritional needs, age group, and fitness goals.' },
        { icon: '💬', title: 'Expert Guidance', desc: 'Connect directly with nutrition experts through our built-in messaging system for personalized advice.' },
    ];

    const steps = [
        { num: '01', title: 'Create Account', desc: 'Sign up in seconds and set up your health profile with basic information.' },
        { num: '02', title: 'Log Your Meals', desc: 'Enter your daily food intake from our comprehensive nutritional database.' },
        { num: '03', title: 'Get Analysis', desc: 'Receive detailed nutrient analysis and deficiency detection results.' },
        { num: '04', title: 'Follow Plans', desc: 'Follow personalized diet and fitness recommendations for optimal health.' },
    ];

    const testimonials = [
        { name: 'Priya S.', role: 'Parent', text: 'NutriFit helped me understand my children\'s nutritional gaps. The diet plans are practical and easy to follow!', avatar: 'PS' },
        { name: 'Rahul M.', role: 'Fitness Enthusiast', text: 'The fitness tracking combined with diet analysis is exactly what I needed. My energy levels have improved significantly.', avatar: 'RM' },
        { name: 'Dr. Anita K.', role: 'Pediatrician', text: 'I recommend NutriFit to my patients. The nutrient deficiency detection is remarkably accurate and the interface is intuitive.', avatar: 'AK' },
    ];

    const stats = [
        { value: '50K+', label: 'Active Users' },
        { value: '2M+', label: 'Meals Tracked' },
        { value: '98%', label: 'Accuracy Rate' },
        { value: '4.9', label: 'App Rating' },
    ];

    return (
        <div className="landing-page">
            <Navbar variant="landing" />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb orb-1"></div>
                    <div className="hero-orb orb-2"></div>
                    <div className="hero-orb orb-3"></div>
                    <div className="hero-grid-pattern"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="pulse-dot"></span>
                            Smart Nutrition for Everyone
                        </div>
                        <h1>
                            Balance Your Diet,<br />
                            <span className="gradient-text">Transform Your Life</span>
                        </h1>
                        <p>NutriFit analyzes your dietary habits, detects nutrient deficiencies, and provides personalized diet & fitness plans — especially designed for children and adolescents.</p>
                        <div className="hero-actions">
                            <Link to="/signup" className="btn-primary btn-lg">
                                Start Free Today
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                            <Link to="/login" className="btn-secondary btn-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                Watch Demo
                            </Link>
                        </div>
                        <div className="hero-stats">
                            {stats.map((s, i) => (
                                <div key={i} className="hero-stat">
                                    <span className="stat-value">{s.value}</span>
                                    <span className="stat-label">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="dashboard-preview">
                            <div className="preview-header">
                                <div className="preview-dots">
                                    <span></span><span></span><span></span>
                                </div>
                                <span className="preview-title">NutriFit Dashboard</span>
                            </div>
                            <div className="preview-body">
                                <div className="preview-card card-calories">
                                    <div className="pc-icon">🔥</div>
                                    <div>
                                        <div className="pc-value">1,847</div>
                                        <div className="pc-label">Calories Today</div>
                                    </div>
                                </div>
                                <div className="preview-card card-protein">
                                    <div className="pc-icon">🥩</div>
                                    <div>
                                        <div className="pc-value">72g</div>
                                        <div className="pc-label">Protein Intake</div>
                                    </div>
                                </div>
                                <div className="preview-card card-steps">
                                    <div className="pc-icon">👟</div>
                                    <div>
                                        <div className="pc-value">8,432</div>
                                        <div className="pc-label">Steps Today</div>
                                    </div>
                                </div>
                                <div className="preview-chart">
                                    <div className="chart-title">Weekly Nutrient Score</div>
                                    <div className="chart-bars">
                                        {[75, 60, 85, 90, 70, 80, 95].map((h, i) => (
                                            <div key={i} className="chart-bar-wrapper">
                                                <div className="chart-bar" style={{ height: `${h}%` }}></div>
                                                <span className="chart-day">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="preview-nutrient-ring">
                                    <svg viewBox="0 0 120 120" className="ring-svg">
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="10" />
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="url(#ringGradient)" strokeWidth="10" strokeDasharray="235 314" strokeLinecap="round" transform="rotate(-90 60 60)" />
                                        <defs>
                                            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#22c55e" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="ring-text">
                                        <span className="ring-value">75%</span>
                                        <span className="ring-label">Balanced</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="floating-badge badge-1">
                            <span>✅</span> Iron levels optimal
                        </div>
                        <div className="floating-badge badge-2">
                            <span>⚠️</span> Low Vitamin D
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="section-title">
                        <span className="badge">Features</span>
                        <h2>Everything You Need for a Healthier Life</h2>
                        <p>Comprehensive tools to analyze your diet, track fitness, and get personalized recommendations.</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                                <div className="feature-arrow">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="how-section">
                <div className="container">
                    <div className="section-title">
                        <span className="badge">How It Works</span>
                        <h2>Start Your Health Journey in 4 Steps</h2>
                        <p>Getting started is simple. Our guided process makes healthy living effortless.</p>
                    </div>
                    <div className="steps-grid">
                        {steps.map((s, i) => (
                            <div key={i} className="step-card">
                                <div className="step-num">{s.num}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                {i < 3 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="testimonials-section">
                <div className="container">
                    <div className="section-title">
                        <span className="badge">Testimonials</span>
                        <h2>Loved by Thousands of Users</h2>
                        <p>See what our community has to say about NutriFit.</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonial-card">
                                <div className="testimonial-stars">
                                    {[...Array(5)].map((_, j) => (
                                        <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                    ))}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{t.avatar}</div>
                                    <div>
                                        <div className="author-name">{t.name}</div>
                                        <div className="author-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="pricing-section">
                <div className="container">
                    <div className="section-title">
                        <span className="badge">Pricing</span>
                        <h2>Choose Your Plan</h2>
                        <p>Start free and upgrade as you grow. No hidden fees.</p>
                    </div>
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="pricing-name">Free</div>
                            <div className="pricing-price"><span className="currency">₹</span>0<span className="period">/month</span></div>
                            <ul className="pricing-features">
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Basic diet logging</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> BMI Calculator</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Basic nutrient analysis</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Step tracking</li>
                            </ul>
                            <Link to="/signup" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
                        </div>
                        <div className="pricing-card featured">
                            <div className="pricing-badge">Most Popular</div>
                            <div className="pricing-name">Pro</div>
                            <div className="pricing-price"><span className="currency">₹</span>299<span className="period">/month</span></div>
                            <ul className="pricing-features">
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Everything in Free</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Deficiency detection</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Personalized diet plans</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Fitness analytics</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Expert messaging</li>
                            </ul>
                            <Link to="/signup" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
                        </div>
                        <div className="pricing-card">
                            <div className="pricing-name">Family</div>
                            <div className="pricing-price"><span className="currency">₹</span>599<span className="period">/month</span></div>
                            <ul className="pricing-features">
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Everything in Pro</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Up to 5 family members</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Child health monitoring</li>
                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Priority support</li>
                            </ul>
                            <Link to="/signup" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-bg-elements">
                            <div className="cta-circle c1"></div>
                            <div className="cta-circle c2"></div>
                        </div>
                        <h2>Ready to Transform Your Health?</h2>
                        <p>Join thousands of users already living healthier with NutriFit. Start your journey today — it's free!</p>
                        <div className="cta-actions">
                            <Link to="/signup" className="btn-primary btn-lg">
                                Create Free Account
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
