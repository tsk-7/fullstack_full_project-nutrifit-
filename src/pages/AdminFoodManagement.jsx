import { useState } from 'react';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminFoodManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');

    const foods = [
        { id: 1, name: 'Banana', category: 'Fruit', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, iron: 0.3, calcium: 5, vitC: 10 },
        { id: 2, name: 'Chicken Breast', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, iron: 1, calcium: 15, vitC: 0 },
        { id: 3, name: 'Brown Rice', category: 'Grain', calories: 216, protein: 5, carbs: 45, fat: 1.8, iron: 0.8, calcium: 20, vitC: 0 },
        { id: 4, name: 'Spinach', category: 'Vegetable', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, iron: 2.7, calcium: 99, vitC: 28 },
        { id: 5, name: 'Milk (1 cup)', category: 'Dairy', calories: 149, protein: 8, carbs: 12, fat: 8, iron: 0.1, calcium: 276, vitC: 0 },
        { id: 6, name: 'Almonds (30g)', category: 'Nuts', calories: 164, protein: 6, carbs: 6, fat: 14, iron: 1.1, calcium: 76, vitC: 0 },
        { id: 7, name: 'Salmon (100g)', category: 'Protein', calories: 208, protein: 20, carbs: 0, fat: 13, iron: 0.8, calcium: 12, vitC: 0 },
        { id: 8, name: 'Apple', category: 'Fruit', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, iron: 0.1, calcium: 11, vitC: 8 },
        { id: 9, name: 'Oats (1 cup)', category: 'Grain', calories: 307, protein: 11, carbs: 55, fat: 5, iron: 3.4, calcium: 42, vitC: 0 },
        { id: 10, name: 'Egg (boiled)', category: 'Protein', calories: 78, protein: 6, carbs: 0.6, fat: 5, iron: 0.9, calcium: 25, vitC: 0 },
    ];

    const filteredFoods = foods.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase())
    );

    const dietPlans = [
        { id: 1, name: 'Iron Boost Plan', target: 'Iron Deficiency', meals: 5, users: 234 },
        { id: 2, name: 'Growth Plan (Kids)', target: 'Children 5-12', meals: 5, users: 189 },
        { id: 3, name: 'Calcium Rich Diet', target: 'Calcium Deficiency', meals: 4, users: 156 },
        { id: 4, name: 'Weight Management', target: 'Overweight Adults', meals: 5, users: 312 },
    ];

    return (
        <div className="dashboard-page">
            <Navbar variant="admin" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Food & Diet <span className="gradient-text-purple">Management</span></h1>
                        <p>Manage the nutritional database and diet plans</p>
                    </div>
                </div>

                <div className="food-actions">
                    <div className="search-input-wrapper">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input type="text" placeholder="Search food items..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Food Item
                    </button>
                </div>

                <div className="dash-grid">
                    <div className="dash-card span-3" style={{ gridColumn: 'span 3' }}>
                        <div className="card-header">
                            <h3>Food Database</h3>
                            <span className="card-badge">{filteredFoods.length} items</span>
                        </div>
                        <div className="admin-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Food Name</th>
                                        <th>Category</th>
                                        <th>Calories</th>
                                        <th>Protein</th>
                                        <th>Carbs</th>
                                        <th>Fat</th>
                                        <th>Iron</th>
                                        <th>Calcium</th>
                                        <th>Vit C</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFoods.map((f) => (
                                        <tr key={f.id}>
                                            <td><strong>{f.name}</strong></td>
                                            <td><span className={`category-tag ${f.category.toLowerCase()}`}>{f.category}</span></td>
                                            <td>{f.calories} kcal</td>
                                            <td>{f.protein}g</td>
                                            <td>{f.carbs}g</td>
                                            <td>{f.fat}g</td>
                                            <td>{f.iron}mg</td>
                                            <td>{f.calcium}mg</td>
                                            <td>{f.vitC}mg</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="action-btn" title="Edit">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button className="action-btn delete" title="Delete">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="dash-card span-3" style={{ gridColumn: 'span 3' }}>
                        <div className="card-header">
                            <h3>Diet Plans</h3>
                            <button className="btn-primary btn-sm" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                Create Plan
                            </button>
                        </div>
                        <div className="admin-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Plan Name</th>
                                        <th>Target Group</th>
                                        <th>Meals/Day</th>
                                        <th>Active Users</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dietPlans.map((dp) => (
                                        <tr key={dp.id}>
                                            <td><strong>{dp.name}</strong></td>
                                            <td>{dp.target}</td>
                                            <td>{dp.meals}</td>
                                            <td>{dp.users}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="action-btn" title="Edit">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button className="action-btn delete" title="Delete">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Add Food Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Add New Food Item</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                <div>
                                    <label>Food Name</label>
                                    <input type="text" placeholder="e.g., Quinoa" required />
                                </div>
                                <div>
                                    <label>Category</label>
                                    <select required>
                                        <option value="">Select category</option>
                                        <option value="Fruit">Fruit</option>
                                        <option value="Vegetable">Vegetable</option>
                                        <option value="Protein">Protein</option>
                                        <option value="Grain">Grain</option>
                                        <option value="Dairy">Dairy</option>
                                        <option value="Nuts">Nuts</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div><label>Calories (kcal)</label><input type="number" placeholder="0" required /></div>
                                    <div><label>Protein (g)</label><input type="number" placeholder="0" required /></div>
                                    <div><label>Carbs (g)</label><input type="number" placeholder="0" /></div>
                                    <div><label>Fat (g)</label><input type="number" placeholder="0" /></div>
                                    <div><label>Iron (mg)</label><input type="number" placeholder="0" /></div>
                                    <div><label>Calcium (mg)</label><input type="number" placeholder="0" /></div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Add Food</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFoodManagement;
