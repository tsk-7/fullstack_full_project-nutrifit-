import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNutrition } from '../context/NutritionContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const UserDashboard = () => {
    const { meals, totals, userProfile } = useNutrition();
    const [height, setHeight] = useState(userProfile.height || 170);
    const [weight, setWeight] = useState(userProfile.weight || 65);

    const displayName = userProfile.name || 'User';
    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    const bmiColor = bmi < 18.5 ? '#06b6d4' : bmi < 25 ? '#22c55e' : bmi < 30 ? '#f59e0b' : '#ef4444';

    const calorieTarget = 2000;
    const proteinTarget = 60;
    const carbsTarget = 300;
    const fatTarget = 65;

    // Build daily calorie chart from meals
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = new Date().getDay();
    const todayLabel = days[todayIndex === 0 ? 6 : todayIndex - 1];
    const calorieData = days.map(day => ({
        day,
        calories: day === todayLabel ? totals.calories : 0,
        target: calorieTarget,
    }));

    // Macro split from totals
    const macros = [
        { name: 'Carbs', value: totals.carbs || 0, color: '#22c55e' },
        { name: 'Protein', value: totals.protein || 0, color: '#06b6d4' },
        { name: 'Fat', value: totals.fat || 0, color: '#f59e0b' },
    ];
    const totalMacros = macros.reduce((s, m) => s + m.value, 0);

    // Nutrient bars from totals
    const nutrients = [
        { name: 'Protein', value: totals.protein, target: proteinTarget, unit: 'g', fill: '#06b6d4' },
        { name: 'Iron', value: totals.iron, target: 18, unit: 'mg', fill: '#f59e0b' },
        { name: 'Calcium', value: totals.calcium, target: 1000, unit: 'mg', fill: '#22c55e' },
        { name: 'Vitamin C', value: totals.vitC, target: 90, unit: 'mg', fill: '#ef4444' },
        { name: 'Fiber', value: totals.fiber, target: 25, unit: 'g', fill: '#8b5cf6' },
        { name: 'Vitamin B12', value: totals.vitB12, target: 2.4, unit: 'mcg', fill: '#ec4899' },
    ];

    // Deficiency alerts based on totals
    const deficiencies = [];
    if (totals.iron < 18 && meals.length > 0) deficiencies.push({ name: 'Iron', level: 'Low', type: 'warning', suggestion: 'Add spinach, lentils, or red meat to your meals.' });
    if (totals.calcium < 1000 && meals.length > 0) deficiencies.push({ name: 'Calcium', level: 'Low', type: 'caution', suggestion: 'Include milk, yogurt, or cheese in your diet.' });
    if (totals.vitD < 20 && meals.length > 0) deficiencies.push({ name: 'Vitamin D', level: 'Low', type: 'info', suggestion: 'Consider fortified foods, eggs, or mushrooms.' });
    if (meals.length === 0) deficiencies.push({ name: 'No data', level: 'N/A', type: 'info', suggestion: 'Start adding meals in the Diet Analysis page to see nutrient tracking and deficiency alerts.' });

    const stats = [
        { icon: '🔥', value: totals.calories.toLocaleString(), label: 'Calories Today', trend: meals.length > 0 ? `${Math.round((totals.calories / calorieTarget) * 100)}%` : '0%', up: totals.calories > 0, color: '#22c55e' },
        { icon: '🥩', value: `${totals.protein.toFixed(1)}g`, label: 'Protein', trend: meals.length > 0 ? `${Math.round((totals.protein / proteinTarget) * 100)}%` : '0%', up: totals.protein > 0, color: '#06b6d4' },
        { icon: '💧', value: '0', label: 'Glasses Water', trend: '0%', up: false, color: '#8b5cf6' },
        { icon: '🔥', value: '0', label: 'Cal Burned', trend: '0%', up: false, color: '#f59e0b' },
    ];

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="dashboard-page">
            <Navbar variant="user" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, <span className="gradient-text">{displayName}!</span></h1>
                        <p>Here's your health & nutrition overview for today</p>
                    </div>
                    <div className="header-date">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        {currentDate}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="stats-grid">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-card">
                            <div className="stat-icon" style={{ background: `${s.color}1a`, color: s.color }}>{s.icon}</div>
                            <div className="stat-info">
                                <span className="stat-number">{s.value}</span>
                                <span className="stat-desc">{s.label}</span>
                            </div>
                            <div className={`stat-trend ${s.up ? 'up' : 'down'}`}>{s.trend}</div>
                        </div>
                    ))}
                </div>

                <div className="dash-grid">
                    {/* Weekly Calorie Intake */}
                    <div className="dash-card span-2">
                        <div className="card-header">
                            <h3>Weekly Calorie Intake</h3>
                            <div className="card-legend">
                                <div className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }}></span> Intake</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: '#e2e8f0' }}></span> Target</div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={calorieData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="calories" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* BMI Calculator */}
                    <div className="dash-card">
                        <div className="card-header"><h3>BMI Calculator</h3></div>
                        <div className="bmi-section">
                            <div className="bmi-display">
                                <div className="bmi-circle" style={{ borderColor: bmiColor }}>
                                    <span className="bmi-value" style={{ color: bmiColor }}>{bmi}</span>
                                    <span className="bmi-category">{bmiCategory}</span>
                                </div>
                            </div>
                            <div className="bmi-inputs">
                                <div className="bmi-input-group">
                                    <label>Height (cm)</label>
                                    <input type="range" min="100" max="220" value={height} onChange={(e) => setHeight(e.target.value)} />
                                    <span className="bmi-val">{height} cm</span>
                                </div>
                                <div className="bmi-input-group">
                                    <label>Weight (kg)</label>
                                    <input type="range" min="30" max="150" value={weight} onChange={(e) => setWeight(e.target.value)} />
                                    <span className="bmi-val">{weight} kg</span>
                                </div>
                            </div>
                            <div className="bmi-scale">
                                <div className="scale-segment" style={{ flex: 18.5, background: '#06b6d4' }}><span>Under</span></div>
                                <div className="scale-segment" style={{ flex: 6.5, background: '#22c55e' }}><span>Normal</span></div>
                                <div className="scale-segment" style={{ flex: 5, background: '#f59e0b' }}><span>Over</span></div>
                                <div className="scale-segment" style={{ flex: 10, background: '#ef4444' }}><span>Obese</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Nutrient Analysis */}
                    <div className="dash-card">
                        <div className="card-header">
                            <h3>Nutrient Intake</h3>
                            <span className="card-badge">{meals.length > 0 ? 'Live' : 'No data'}</span>
                        </div>
                        <div className="nutrient-bars">
                            {nutrients.map((n, i) => (
                                <div key={i} className="nutrient-bar-item">
                                    <div className="nb-header">
                                        <span className="nb-name">{n.name}</span>
                                        <span className="nb-value">{n.value.toFixed(1)}{n.unit} / {n.target}{n.unit}</span>
                                    </div>
                                    <div className="nb-track">
                                        <div className="nb-fill" style={{ width: `${Math.min((n.value / n.target) * 100, 100)}%`, background: n.fill }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Macro Split */}
                    <div className="dash-card">
                        <div className="card-header"><h3>Macro Split</h3></div>
                        <div className="macro-chart">
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={totalMacros > 0 ? macros : [{ name: 'No data', value: 1, color: '#e2e8f0' }]} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                                        {(totalMacros > 0 ? macros : [{ color: '#e2e8f0' }]).map((m, i) => <Cell key={i} fill={m.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="macro-legend">
                                {macros.map((m, i) => (
                                    <div key={i} className="macro-item">
                                        <span className="macro-dot" style={{ background: m.color }}></span>
                                        <span>{m.name}</span>
                                        <strong>{m.value.toFixed(1)}g</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Deficiency Alerts */}
                    <div className="dash-card span-2">
                        <div className="card-header">
                            <h3>Deficiency Alerts</h3>
                            <span className="card-badge orange">{deficiencies.filter(d => d.name !== 'No data').length} detected</span>
                        </div>
                        <div className="deficiency-list">
                            {deficiencies.map((d, i) => (
                                <div key={i} className={`deficiency-item ${d.type}`}>
                                    <div className="di-top">
                                        <span className="di-name">{d.name}</span>
                                        <span className={`di-status ${d.type}`}>{d.level}</span>
                                    </div>
                                    <p className="di-suggestion">{d.suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
