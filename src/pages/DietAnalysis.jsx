import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNutrition } from '../context/NutritionContext';
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from 'recharts';
import './DietAnalysis.css';

const DietAnalysis = () => {
    const { meals, addMeal, totals } = useNutrition();
    const [selectedMeal, setSelectedMeal] = useState('');
    const [selectedTime, setSelectedTime] = useState('Breakfast');

    // Calculate nutrient scores based on daily targets (percentage)
    const proteinTarget = 60;
    const ironTarget = 18;
    const calciumTarget = 1000;
    const vitDTarget = 20;
    const vitCTarget = 90;
    const fiberTarget = 25;

    const nutrientScores = [
        { name: 'Protein', value: Math.min(Math.round((totals.protein / proteinTarget) * 100), 100), fill: '#22c55e' },
        { name: 'Iron', value: Math.min(Math.round((totals.iron / ironTarget) * 100), 100), fill: '#ef4444' },
        { name: 'Calcium', value: Math.min(Math.round((totals.calcium / calciumTarget) * 100), 100), fill: '#06b6d4' },
        { name: 'Vit D', value: Math.min(Math.round((totals.vitD / vitDTarget) * 100), 100), fill: '#8b5cf6' },
        { name: 'Vit C', value: Math.min(Math.round((totals.vitC / vitCTarget) * 100), 100), fill: '#f59e0b' },
        { name: 'Fiber', value: Math.min(Math.round((totals.fiber / fiberTarget) * 100), 100), fill: '#ec4899' },
    ];

    const dietPlan = [
        { meal: 'Breakfast', items: ['Whole grain toast with avocado', 'Boiled eggs (2)', 'Fresh orange juice'], time: '7:30 AM' },
        { meal: 'Mid-Morning', items: ['Mixed nuts (30g)', 'Fresh fruits'], time: '10:00 AM' },
        { meal: 'Lunch', items: ['Grilled fish with veggies', 'Brown rice (1 cup)', 'Green salad'], time: '1:00 PM' },
        { meal: 'Snack', items: ['Yogurt with berries', 'Whole grain crackers'], time: '4:00 PM' },
        { meal: 'Dinner', items: ['Lentil soup', 'Chapati (2)', 'Steamed vegetables'], time: '7:30 PM' },
    ];

    const foodDatabase = [
        { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, iron: 0.3, calcium: 5, vitC: 10, vitD: 0, fiber: 3, vitB12: 0, category: 'Fruit', vitamins: ['B6', 'C'] },
        { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, iron: 1, calcium: 15, vitC: 0, vitD: 0, fiber: 0, vitB12: 0.3, category: 'Protein', vitamins: ['B6', 'B12'] },
        { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, iron: 1, calcium: 20, vitC: 0, vitD: 0, fiber: 3.5, vitB12: 0, category: 'Grain', vitamins: ['B1', 'B6'] },
        { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, iron: 2.7, calcium: 99, vitC: 28, vitD: 0, fiber: 2.2, vitB12: 0, category: 'Vegetable', vitamins: ['A', 'C', 'K'] },
        { name: 'Milk (1 cup)', calories: 149, protein: 8, carbs: 12, fat: 8, iron: 0.1, calcium: 276, vitC: 0, vitD: 3, fiber: 0, vitB12: 1.1, category: 'Dairy', vitamins: ['D', 'B12'] },
        { name: 'Almonds (30g)', calories: 164, protein: 6, carbs: 6, fat: 14, iron: 1, calcium: 76, vitC: 0, vitD: 0, fiber: 3.5, vitB12: 0, category: 'Nuts', vitamins: ['E', 'B2'] },
        { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, iron: 0.8, calcium: 12, vitC: 0, vitD: 11, fiber: 0, vitB12: 2.8, category: 'Protein', vitamins: ['D', 'B12', 'Omega-3'] },
        { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, iron: 0.2, calcium: 11, vitC: 8, vitD: 0, fiber: 4.4, vitB12: 0, category: 'Fruit', vitamins: ['C'] },
        { name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5, iron: 0.9, calcium: 28, vitC: 0, vitD: 1, fiber: 0, vitB12: 0.6, category: 'Protein', vitamins: ['D', 'B12'] },
        { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, iron: 1.7, calcium: 20, vitC: 0, vitD: 0, fiber: 4, vitB12: 0, category: 'Grain', vitamins: ['B1', 'B6'] },
        { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, iron: 0.1, calcium: 200, vitC: 0, vitD: 0, fiber: 0, vitB12: 1.3, category: 'Dairy', vitamins: ['B12', 'B2'] },
        { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, iron: 1, calcium: 47, vitC: 89, vitD: 0, fiber: 5.1, vitB12: 0, category: 'Vegetable', vitamins: ['C', 'K'] },
    ];

    const handleAddMeal = () => {
        if (selectedMeal) {
            const food = foodDatabase.find(f => f.name === selectedMeal);
            if (food) {
                addMeal({ 
                    time: selectedTime, 
                    food: food.name, 
                    calories: food.calories, 
                    protein: food.protein, 
                    carbs: food.carbs, 
                    fat: food.fat,
                    iron: food.iron,
                    calcium: food.calcium,
                    vitC: food.vitC,
                    vitD: food.vitD,
                    fiber: food.fiber,
                    vitB12: food.vitB12,
                    vitamins: food.vitamins 
                });
                setSelectedMeal('');
            }
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar variant="user" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Diet <span className="gradient-text">Analysis</span></h1>
                        <p>Track your meals, analyze nutrients, and get personalized recommendations</p>
                    </div>
                </div>

                {/* Add Food */}
                <div className="diet-add-section">
                    <div className="add-food-card">
                        <h3>📝 Log a Meal</h3>
                        <div className="add-food-row">
                            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="food-select time-select">
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Snack">Snack</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                            <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)} className="food-select">
                                <option value="">Select food from database...</option>
                                {foodDatabase.map((f, i) => (
                                    <option key={i} value={f.name}>{f.name} — {f.calories} kcal, {f.protein}g protein</option>
                                ))}
                            </select>
                            <button className="btn-primary" onClick={handleAddMeal}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                Add Meal
                            </button>
                        </div>
                    </div>
                </div>

                {/* Totals */}
                <div className="diet-totals">
                    <div className="total-card">
                        <div className="tc-icon">🔥</div>
                        <div className="tc-value">{totals.calories}</div>
                        <div className="tc-label">Total Calories</div>
                    </div>
                    <div className="total-card">
                        <div className="tc-icon">🥩</div>
                        <div className="tc-value">{totals.protein}g</div>
                        <div className="tc-label">Protein</div>
                    </div>
                    <div className="total-card">
                        <div className="tc-icon">🌾</div>
                        <div className="tc-value">{totals.carbs}g</div>
                        <div className="tc-label">Carbs</div>
                    </div>
                    <div className="total-card">
                        <div className="tc-icon">🥑</div>
                        <div className="tc-value">{totals.fat}g</div>
                        <div className="tc-label">Fats</div>
                    </div>
                </div>

                <div className="diet-grid">
                    {/* Meals Log */}
                    <div className="dash-card span-2">
                        <div className="card-header">
                            <h3>Today's Meals</h3>
                            <span className="card-badge green">{meals.length} meals</span>
                        </div>
                        {meals.length === 0 ? (
                            <div className="empty-meals">
                                <p>No meals logged yet. Add your first meal above to start tracking!</p>
                            </div>
                        ) : (
                            <div className="meals-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Food Item</th>
                                            <th>Calories</th>
                                            <th>Protein</th>
                                            <th>Vitamins</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meals.map((m) => (
                                            <tr key={m.id}>
                                                <td><span className="meal-time">{m.time}</span></td>
                                                <td>{m.food}</td>
                                                <td><strong>{m.calories}</strong> kcal</td>
                                                <td>{m.protein}g</td>
                                                <td>
                                                    <div className="vitamin-tags">
                                                        {m.vitamins && m.vitamins.map((v, j) => <span key={j} className="vit-tag">{v}</span>)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Nutrient Scores */}
                    <div className="dash-card">
                        <div className="card-header">
                            <h3>Nutrient Scores</h3>
                        </div>
                        <div className="nutrient-scores">
                            {nutrientScores.map((n, i) => (
                                <div key={i} className="ns-item">
                                    <div className="ns-ring">
                                        <svg viewBox="0 0 36 36" className="ns-svg">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={n.fill} strokeWidth="3" strokeDasharray={`${n.value}, 100`} strokeLinecap="round" />
                                        </svg>
                                        <span className="ns-val" style={{ color: n.fill }}>{n.value}%</span>
                                    </div>
                                    <span className="ns-name">{n.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Diet Plan */}
                    <div className="dash-card span-3">
                        <div className="card-header">
                            <h3>🍎 Personalized Diet Plan</h3>
                            <span className="card-badge green">AI Generated</span>
                        </div>
                        <div className="diet-plan-grid">
                            {dietPlan.map((dp, i) => (
                                <div key={i} className="diet-plan-card">
                                    <div className="dpc-time">{dp.time}</div>
                                    <div className="dpc-meal">{dp.meal}</div>
                                    <ul className="dpc-items">
                                        {dp.items.map((item, j) => (
                                            <li key={j}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DietAnalysis;
