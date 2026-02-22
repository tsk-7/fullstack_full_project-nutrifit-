import { useState } from 'react';
import Navbar from '../components/Navbar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNutrition } from '../context/NutritionContext';
import './FitnessTracker.css';

const FitnessTracker = () => {
    const { totals } = useNutrition();
    
    // Goals for daily intake
    const caloriesGoal = 2000;
    const carbsGoal = 300;
    const fatGoal = 65;
    const proteinGoal = 50;
    
    // Calculate percentages based on food intake
    const caloriesPercent = Math.min((totals.calories / caloriesGoal) * 100, 100);
    const carbsPercent = Math.min((totals.carbs / carbsGoal) * 100, 100);
    const fatPercent = Math.min((totals.fat / fatGoal) * 100, 100);
    const proteinPercent = Math.min((totals.protein / proteinGoal) * 100, 100);

    const weeklyNutrition = [
        { day: 'Mon', calories: 0, protein: 0 },
        { day: 'Tue', calories: 0, protein: 0 },
        { day: 'Wed', calories: 0, protein: 0 },
        { day: 'Thu', calories: 0, protein: 0 },
        { day: 'Fri', calories: 0, protein: 0 },
        { day: 'Sat', calories: 0, protein: 0 },
        { day: 'Sun', calories: totals.calories, protein: totals.protein },
    ];

    const monthlyProgress = [
        { week: 'Week 1', weight: 68, bmi: 23.5 },
        { week: 'Week 2', weight: 67.5, bmi: 23.3 },
        { week: 'Week 3', weight: 67, bmi: 23.1 },
        { week: 'Week 4', weight: 66.2, bmi: 22.8 },
    ];

    const achievements = [
        { title: 'First Meal', desc: 'Logged your first meal', icon: '🍽️', earned: totals.calories > 0 },
        { title: 'Protein Pro', desc: 'Consumed 50g+ protein', icon: '💪', earned: totals.protein >= 50 },
        { title: 'Balanced Diet', desc: 'Hit all nutrient goals', icon: '⚖️', earned: caloriesPercent >= 80 && carbsPercent >= 80 && fatPercent >= 80 },
        { title: 'Nutrition Master', desc: 'Reach 2000 calories', icon: '🏆', earned: totals.calories >= 2000 },
    ];

    return (
        <div className="dashboard-page">
            <Navbar variant="user" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Fitness <span className="gradient-text">Tracker</span></h1>
                        <p>Monitor your daily activity, calories burned, and fitness progress</p>
                    </div>
                </div>

                {/* Nutrition Stats */}
                <div className="fitness-stats">
                    <div className="fitness-stat-card">
                        <div className="fs-icon">🔥</div>
                        <div className="fs-value">{totals.calories}</div>
                        <div className="fs-label">Calories Consumed</div>
                        <div className="fs-bar">
                            <div className="fs-bar-fill" style={{ width: `${caloriesPercent}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}></div>
                        </div>
                        <span className="fs-target">Goal: {caloriesGoal} kcal</span>
                    </div>

                    <div className="fitness-stat-card">
                        <div className="fs-icon">🍞</div>
                        <div className="fs-value">{totals.carbs}g</div>
                        <div className="fs-label">Carbohydrates</div>
                        <div className="fs-bar">
                            <div className="fs-bar-fill" style={{ width: `${carbsPercent}%`, background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }}></div>
                        </div>
                        <span className="fs-target">Goal: {carbsGoal}g</span>
                    </div>

                    <div className="fitness-stat-card">
                        <div className="fs-icon">🥑</div>
                        <div className="fs-value">{totals.fat}g</div>
                        <div className="fs-label">Fats</div>
                        <div className="fs-bar">
                            <div className="fs-bar-fill" style={{ width: `${fatPercent}%`, background: 'linear-gradient(90deg, #22c55e, #06b6d4)' }}></div>
                        </div>
                        <span className="fs-target">Goal: {fatGoal}g</span>
                    </div>

                    <div className="fitness-stat-card">
                        <div className="fs-icon">💪</div>
                        <div className="fs-value">{totals.protein}g</div>
                        <div className="fs-label">Protein</div>
                        <div className="fs-bar">
                            <div className="fs-bar-fill" style={{ width: `${proteinPercent}%`, background: 'linear-gradient(90deg, #ec4899, #f59e0b)' }}></div>
                        </div>
                        <span className="fs-target">Goal: {proteinGoal}g</span>
                    </div>
                </div>

                <div className="dash-grid">
                    {/* Weekly Nutrition */}
                    <div className="dash-card span-2">
                        <div className="card-header">
                            <h3>Weekly Nutrition</h3>
                            <div className="card-legend">
                                <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }}></span>Calories</span>
                                <span className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }}></span>Protein (g)</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weeklyNutrition}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                                <YAxis yAxisId="calories" stroke="#64748b" fontSize={12} />
                                <YAxis yAxisId="protein" orientation="right" stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                <Bar yAxisId="calories" dataKey="calories" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="protein" dataKey="protein" fill="url(#fitBarGrad)" radius={[4, 4, 0, 0]} opacity={0.7} />
                                <defs>
                                    <linearGradient id="fitBarGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Nutrient Summary */}
                    <div className="dash-card">
                        <div className="card-header">
                            <h3>Today's Nutrients</h3>
                        </div>
                        <div className="nutrient-summary-list">
                            <div className="nutrient-summary-item">
                                <span className="ns-label">Iron</span>
                                <span className="ns-value">{totals.iron}mg</span>
                            </div>
                            <div className="nutrient-summary-item">
                                <span className="ns-label">Calcium</span>
                                <span className="ns-value">{totals.calcium}mg</span>
                            </div>
                            <div className="nutrient-summary-item">
                                <span className="ns-label">Vitamin C</span>
                                <span className="ns-value">{totals.vitC}mg</span>
                            </div>
                            <div className="nutrient-summary-item">
                                <span className="ns-label">Vitamin D</span>
                                <span className="ns-value">{totals.vitD}mcg</span>
                            </div>
                            <div className="nutrient-summary-item">
                                <span className="ns-label">Fiber</span>
                                <span className="ns-value">{totals.fiber}g</span>
                            </div>
                            <div className="nutrient-summary-item">
                                <span className="ns-label">Vitamin B12</span>
                                <span className="ns-value">{totals.vitB12}mcg</span>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Progress */}
                    <div className="dash-card span-2">
                        <div className="card-header">
                            <h3>Monthly Progress</h3>
                            <div className="card-legend">
                                <span className="legend-item"><span className="legend-dot" style={{ background: '#06b6d4' }}></span>Weight</span>
                                <span className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }}></span>BMI</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={monthlyProgress}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                <Line type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
                                <Line type="monotone" dataKey="bmi" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Achievements */}
                    <div className="dash-card">
                        <div className="card-header">
                            <h3>Achievements</h3>
                        </div>
                        <div className="achievement-list">
                            {achievements.map((a, i) => (
                                <div key={i} className={`achievement-item ${a.earned ? 'earned' : 'locked'}`}>
                                    <div className="ach-icon">{a.icon}</div>
                                    <div className="ach-info">
                                        <div className="ach-title">{a.title}</div>
                                        <div className="ach-desc">{a.desc}</div>
                                    </div>
                                    {a.earned && <div className="ach-check">✓</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FitnessTracker;
