import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNutrition } from '../context/NutritionContext';
import { foodAPI } from '../services/api';
import './DietAnalysis.css';

const DietAnalysis = () => {
    const { meals, addMeal, totals, waterGlasses, updateWaterGlasses, getDailyReport, error: contextError } = useNutrition();
    const [selectedMealId, setSelectedMealId] = useState('');
    const [selectedTime, setSelectedTime] = useState('Breakfast');
    const [selectedDietType, setSelectedDietType] = useState('all');
    const [addMealError, setAddMealError] = useState('');
    const [manualFoodName, setManualFoodName] = useState('');
    const [manualCalories, setManualCalories] = useState('');
    const [manualProtein, setManualProtein] = useState('');
    const [manualCarbs, setManualCarbs] = useState('');
    const [manualFat, setManualFat] = useState('');
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailyReport, setDailyReport] = useState(null);
    const [loadingReport, setLoadingReport] = useState(false);
    const [reportLastUpdated, setReportLastUpdated] = useState('');
    const [waterDraft, setWaterDraft] = useState(String(waterGlasses || 0));
    const [reportRefreshKey, setReportRefreshKey] = useState(0);
    const [foods, setFoods] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(true);
    const [foodsError, setFoodsError] = useState('');

    useEffect(() => {
        const loadFoods = async () => {
            try {
                setLoadingFoods(true);
                const data = await foodAPI.getAllFoods();
                setFoods(Array.isArray(data) ? data : []);
            } catch (error) {
                setFoodsError(error.message || 'Failed to load foods');
            } finally {
                setLoadingFoods(false);
            }
        };

        loadFoods();
    }, []);

    const loadReport = async () => {
        setLoadingReport(true);
        const report = await getDailyReport(reportDate);
        setDailyReport(report);
        setReportLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setLoadingReport(false);
    };

    useEffect(() => {
        loadReport();
    }, [reportDate, reportRefreshKey]);

    useEffect(() => {
        setWaterDraft(String(waterGlasses || 0));
    }, [waterGlasses]);

    const detectDietType = (food) => {
        const explicitType = String(food.dietType || food.diet_type || '').trim().toLowerCase();
        if (explicitType === 'veg' || explicitType === 'nonveg') {
            return explicitType;
        }

        const text = `${food.name || ''} ${food.category || ''}`.toLowerCase();
        return /(chicken|fish|egg|eggs|mutton|meat|beef|pork|lamb|duck|goat|prawn|shrimp|crab|lobster|keema|chorizo)/i.test(text)
            ? 'nonveg'
            : 'veg';
    };

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

    const foodDatabase = useMemo(() => foods.map((food) => ({
        id: food.id,
        name: food.name,
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
        category: food.category || 'General',
        dietType: detectDietType(food)
    })), [foods]);

    const filteredFoods = useMemo(() => foodDatabase.filter((food) => {
        if (selectedDietType === 'all') return true;
        return food.dietType === selectedDietType;
    }), [foodDatabase, selectedDietType]);

    const fruitsFoods = useMemo(() => foodDatabase.filter((food) => /fruit/i.test(String(food.category || ''))), [foodDatabase]);
    const liquidsFoods = useMemo(() => foodDatabase.filter((food) => /liquid|juice|beverage|drink|milk/i.test(String(food.category || '')) || /juice|smoothie|water|drink|shake|lassi|tea|coffee|milk/i.test(food.name)), [foodDatabase]);

    useEffect(() => {
        if (selectedMealId && !filteredFoods.some((food) => String(food.id) === String(selectedMealId))) {
            setSelectedMealId('');
        }
    }, [filteredFoods, selectedMealId]);

    const handleAddMeal = async () => {
        if (selectedMealId) {
            const food = foodDatabase.find((f) => String(f.id) === String(selectedMealId));
            if (food) {
                setAddMealError('');
                const success = await addMeal({ 
                    mealTime: selectedTime,
                    name: food.name,
                    foodId: food.id,
                    calories: food.calories, 
                    protein: food.protein, 
                    carbs: food.carbs, 
                    fat: food.fat,
                    iron: food.iron,
                    calcium: food.calcium,
                    vitC: food.vitC,
                    vitD: food.vitD,
                    fiber: food.fiber,
                    vitB12: food.vitB12
                });
                if (success) {
                    setSelectedMealId('');
                    setAddMealError('');
                    setReportRefreshKey((prev) => prev + 1);
                } else {
                    setAddMealError(contextError || 'Failed to add meal');
                }
            }
        }
    };

    const handleAddManualMeal = async () => {
        if (!manualFoodName.trim() || !manualCalories) {
            setAddMealError('Manual food name and calories are required');
            return;
        }

        const success = await addMeal({
            mealTime: selectedTime,
            name: manualFoodName.trim(),
            calories: Number(manualCalories),
            protein: Number(manualProtein || 0),
            carbs: Number(manualCarbs || 0),
            fat: Number(manualFat || 0)
        });

        if (success) {
            setManualFoodName('');
            setManualCalories('');
            setManualProtein('');
            setManualCarbs('');
            setManualFat('');
            setAddMealError('');
            setReportRefreshKey((prev) => prev + 1);
        } else {
            setAddMealError(contextError || 'Failed to add manual meal');
        }
    };

    const handleSetWater = async (nextValue) => {
        const safeValue = Math.max(0, Math.min(30, Number(nextValue || 0)));
        const success = await updateWaterGlasses(safeValue);
        if (!success) {
            setAddMealError(contextError || 'Failed to update water');
            return false;
        }
        setAddMealError('');
        setWaterDraft(String(safeValue));
        setReportRefreshKey((prev) => prev + 1);
        return true;
    };

    const commitWaterDraft = async () => {
        const parsed = Number(waterDraft);
        if (!Number.isFinite(parsed)) {
            setAddMealError('Enter a valid number of glasses');
            return;
        }
        await handleSetWater(parsed);
    };

    const handleQuickAdd = async (food) => {
        const success = await addMeal({
            mealTime: selectedTime,
            name: food.name,
            foodId: food.id,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            iron: food.iron,
            calcium: food.calcium,
            vitC: food.vitC,
            vitD: food.vitD,
            fiber: food.fiber,
            vitB12: food.vitB12
        });
        if (!success) {
            setAddMealError(contextError || 'Failed to add food');
            return;
        }
        setReportRefreshKey((prev) => prev + 1);
    };

    const printReport = async () => {
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) {
            setAddMealError('Please allow popups to print the report');
            return;
        }

        printWindow.document.write('<html><body style="font-family: Arial, sans-serif; padding: 24px;">Preparing report...</body></html>');
        printWindow.document.close();

        const report = await getDailyReport(reportDate);
        if (!report) {
            setAddMealError('Failed to generate report for printing');
            printWindow.close();
            return;
        }

        const rows = (report.meals || []).map((meal) => `
            <tr>
                <td>${meal.mealTime || '-'}</td>
                <td>${meal.name || '-'}</td>
                <td>${meal.calories || 0}</td>
                <td>${meal.protein || 0}</td>
                <td>${meal.carbs || 0}</td>
                <td>${meal.fat || 0}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Nutrition Report - ${report.date}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; }
                        h1, h2 { margin: 0 0 12px; }
                        .meta { margin-bottom: 16px; color: #555; }
                        table { width: 100%; border-collapse: collapse; margin-top: 14px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background: #f1f5f9; }
                        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 16px 0; }
                        .card { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
                    </style>
                </head>
                <body>
                    <h1>Complete Daily Nutrition Report</h1>
                    <div class="meta">Date: ${report.date}</div>
                    <div class="grid">
                        <div class="card"><strong>Calories</strong><div>${report.totals?.calories || 0}</div></div>
                        <div class="card"><strong>Protein</strong><div>${report.totals?.protein || 0} g</div></div>
                        <div class="card"><strong>Carbs</strong><div>${report.totals?.carbs || 0} g</div></div>
                        <div class="card"><strong>Fat</strong><div>${report.totals?.fat || 0} g</div></div>
                        <div class="card"><strong>Fiber</strong><div>${report.totals?.fiber || 0} g</div></div>
                        <div class="card"><strong>Water</strong><div>${report.waterGlasses || 0} glasses</div></div>
                    </div>
                    <h2>Meals</h2>
                    <table>
                        <thead>
                            <tr><th>Time</th><th>Food</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr>
                        </thead>
                        <tbody>${rows || '<tr><td colspan="6">No meals logged</td></tr>'}</tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
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
                        {(foodsError || addMealError) && <div style={{color: '#ef4444', marginBottom: '12px', fontSize: '14px'}}>❌ {foodsError || addMealError}</div>}
                        <div className="diet-filter-row">
                            {['all', 'veg', 'nonveg'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`diet-filter-btn ${selectedDietType === type ? 'active' : ''}`}
                                    onClick={() => setSelectedDietType(type)}
                                >
                                    {type === 'all' ? 'All Foods' : type === 'veg' ? 'Veg' : 'Non-Veg'}
                                </button>
                            ))}
                            <span className="diet-filter-count">{filteredFoods.length} items available</span>
                        </div>
                        <div className="add-food-row">
                            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="food-select time-select">
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Snack">Snack</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                            <select value={selectedMealId} onChange={(e) => setSelectedMealId(e.target.value)} className="food-select">
                                <option value="">{loadingFoods ? 'Loading foods...' : `Select ${selectedDietType === 'all' ? '' : `${selectedDietType} `}food from database...`}</option>
                                {filteredFoods.map((f) => (
                                    <option key={f.id} value={f.id}>{f.name} — {f.calories} kcal, {f.protein}g protein, {f.dietType === 'nonveg' ? 'Non-Veg' : 'Veg'}</option>
                                ))}
                            </select>
                            <button className="btn-primary" onClick={handleAddMeal}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                Add Meal
                            </button>
                        </div>

                        <div className="manual-entry-grid">
                            <input value={manualFoodName} onChange={(e) => setManualFoodName(e.target.value)} placeholder="Custom food name" className="food-select" />
                            <input value={manualCalories} onChange={(e) => setManualCalories(e.target.value)} placeholder="Calories" type="number" className="food-select" />
                            <input value={manualProtein} onChange={(e) => setManualProtein(e.target.value)} placeholder="Protein (g)" type="number" className="food-select" />
                            <input value={manualCarbs} onChange={(e) => setManualCarbs(e.target.value)} placeholder="Carbs (g)" type="number" className="food-select" />
                            <input value={manualFat} onChange={(e) => setManualFat(e.target.value)} placeholder="Fat (g)" type="number" className="food-select" />
                            <button className="btn-secondary" onClick={handleAddManualMeal}>Add Custom Meal</button>
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
                    <div className="total-card">
                        <div className="tc-icon">💧</div>
                        <div className="tc-value">{waterGlasses}</div>
                        <div className="tc-label">Water Glasses</div>
                    </div>
                </div>

                <div className="water-controls">
                    <h3>Hydration Tracker</h3>
                    <div className="water-actions">
                        <button className="btn-secondary" onClick={() => handleSetWater(waterGlasses - 1)}>-1 Glass</button>
                        <input
                            className="food-select water-input"
                            type="number"
                            min="0"
                            max="30"
                            value={waterDraft}
                            onChange={(e) => setWaterDraft(e.target.value)}
                        />
                        <button className="btn-primary" onClick={() => handleSetWater(waterGlasses + 1)}>+1 Glass</button>
                        <button className="btn-secondary" onClick={commitWaterDraft}>Update Water</button>
                    </div>
                </div>

                <div className="quick-category-grid">
                    <div className="dash-card">
                        <div className="card-header"><h3>Fruits Block</h3><span className="card-badge green">{fruitsFoods.length}</span></div>
                        <div className="quick-list">
                            {fruitsFoods.slice(0, 10).map((food) => (
                                <button key={food.id} type="button" className="quick-item" onClick={() => handleQuickAdd(food)}>
                                    <span>{food.name}</span>
                                    <small>{food.calories} kcal</small>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="dash-card">
                        <div className="card-header"><h3>Liquids/Juices Block</h3><span className="card-badge green">{liquidsFoods.length}</span></div>
                        <div className="quick-list">
                            {liquidsFoods.slice(0, 10).map((food) => (
                                <button key={food.id} type="button" className="quick-item" onClick={() => handleQuickAdd(food)}>
                                    <span>{food.name}</span>
                                    <small>{food.calories} kcal</small>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dash-card report-card">
                    <div className="card-header">
                        <h3>Complete Daily Report</h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button className="btn-secondary" onClick={loadReport}>Refresh</button>
                            <button className="btn-secondary" onClick={printReport}>Print Report</button>
                        </div>
                    </div>
                    <div className="report-controls">
                        <label htmlFor="reportDate">Date</label>
                        <input id="reportDate" type="date" className="food-select" value={reportDate} onChange={(e) => setReportDate(e.target.value)} />
                        <span className="diet-filter-count">Status: {loadingReport ? 'Updating...' : `Updated at ${reportLastUpdated || '-'}`}</span>
                    </div>
                    {loadingReport ? (
                        <p>Loading report...</p>
                    ) : (
                        <div className="report-grid">
                            <div className="report-pill">Meals: {dailyReport?.meals?.length || 0}</div>
                            <div className="report-pill">Calories: {dailyReport?.totals?.calories || 0}</div>
                            <div className="report-pill">Protein: {dailyReport?.totals?.protein || 0} g</div>
                            <div className="report-pill">Carbs: {dailyReport?.totals?.carbs || 0} g</div>
                            <div className="report-pill">Fat: {dailyReport?.totals?.fat || 0} g</div>
                            <div className="report-pill">Iron: {dailyReport?.totals?.iron || 0} mg</div>
                            <div className="report-pill">Calcium: {dailyReport?.totals?.calcium || 0} mg</div>
                            <div className="report-pill">Vit C: {dailyReport?.totals?.vitC || 0} mg</div>
                            <div className="report-pill">Vit D: {dailyReport?.totals?.vitD || 0}</div>
                            <div className="report-pill">Fiber: {dailyReport?.totals?.fiber || 0} g</div>
                            <div className="report-pill">Vit B12: {dailyReport?.totals?.vitB12 || 0}</div>
                            <div className="report-pill">Water: {dailyReport?.waterGlasses || 0} glasses</div>
                            <div className="report-pill">Fruits: {dailyReport?.fruits?.length || 0}</div>
                            <div className="report-pill">Liquids: {dailyReport?.liquids?.length || 0}</div>
                        </div>
                    )}
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
                                                <td><span className="meal-time">{m.time || m.mealTime || '-'}</span></td>
                                                <td>{m.food || m.name}</td>
                                                <td><strong>{m.calories}</strong> kcal</td>
                                                <td>{m.protein}g</td>
                                                <td>
                                                    <div className="vitamin-tags">
                                                        {(m.vitC > 0 || m.vitD > 0 || m.vitB12 > 0 || m.fiber > 0) ? (
                                                            <>
                                                                {m.vitC > 0 && <span className="vit-tag">Vit C</span>}
                                                                {m.vitD > 0 && <span className="vit-tag">Vit D</span>}
                                                                {m.vitB12 > 0 && <span className="vit-tag">B12</span>}
                                                                {m.fiber > 0 && <span className="vit-tag">Fiber</span>}
                                                            </>
                                                        ) : (
                                                            <span className="vit-tag">-</span>
                                                        )}
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
