import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { foodAPI } from '../services/api';
import './AdminDashboard.css';

const emptyFoodForm = {
    name: '',
    category: '',
    dietType: 'veg',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    iron: '',
    calcium: '',
    vitC: '',
    vitD: '',
    fiber: '',
    vitB12: ''
};

const AdminFoodManagement = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(emptyFoodForm);

    const loadFoods = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await foodAPI.getAllFoods();
            setFoods(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Failed to load foods');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFoods();
    }, []);

    const filteredFoods = useMemo(() => foods.filter((food) => {
        const q = search.toLowerCase();
        return food.name.toLowerCase().includes(q) || (food.category || '').toLowerCase().includes(q) || (food.dietType || '').toLowerCase().includes(q);
    }), [foods, search]);

    const openCreateModal = () => {
        setEditingFood(null);
        setFormData(emptyFoodForm);
        setShowModal(true);
    };

    const openEditModal = (food) => {
        setEditingFood(food);
        setFormData({
            name: food.name || '',
            category: food.category || '',
            dietType: food.dietType || food.diet_type || 'veg',
            calories: food.calories ?? '',
            protein: food.protein ?? '',
            carbs: food.carbs ?? '',
            fat: food.fat ?? '',
            iron: food.iron ?? '',
            calcium: food.calcium ?? '',
            vitC: food.vitC ?? '',
            vitD: food.vitD ?? '',
            fiber: food.fiber ?? '',
            vitB12: food.vitB12 ?? ''
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                name: formData.name.trim(),
                category: formData.category.trim() || null,
                dietType: formData.dietType,
                calories: Number(formData.calories),
                protein: Number(formData.protein || 0),
                carbs: Number(formData.carbs || 0),
                fat: Number(formData.fat || 0),
                iron: Number(formData.iron || 0),
                calcium: Number(formData.calcium || 0),
                vitC: Number(formData.vitC || 0),
                vitD: Number(formData.vitD || 0),
                fiber: Number(formData.fiber || 0),
                vitB12: Number(formData.vitB12 || 0)
            };

            if (!payload.name || Number.isNaN(payload.calories)) {
                throw new Error('Food name and calories are required.');
            }

            if (editingFood) {
                await foodAPI.updateFood(editingFood.id, payload);
            } else {
                await foodAPI.createFood(payload);
            }

            setShowModal(false);
            setEditingFood(null);
            setFormData(emptyFoodForm);
            await loadFoods();
        } catch (err) {
            setError(err.message || 'Failed to save food');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (foodId) => {
        const confirmed = window.confirm('Delete this food item?');
        if (!confirmed) return;
        try {
            await foodAPI.deleteFood(foodId);
            await loadFoods();
        } catch (err) {
            setError(err.message || 'Failed to delete food');
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar variant="admin" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Food & Diet <span className="gradient-text-purple">Management</span></h1>
                        <p>Maintain the live nutrition database used by the app</p>
                    </div>
                    <button className="btn-primary" onClick={openCreateModal}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Food Item
                    </button>
                </div>

                <div className="food-actions">
                    <div className="search-input-wrapper" style={{ minWidth: '280px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input type="text" placeholder="Search food items..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="card-badge">{filteredFoods.length} items</div>
                </div>

                {loading && <div className="dash-card" style={{ padding: '16px' }}>Loading food database...</div>}
                {error && <div className="dash-card" style={{ padding: '16px', color: '#ef4444' }}>{error}</div>}

                <div className="dash-card" style={{ gridColumn: 'span 3' }}>
                    <div className="card-header">
                        <h3>Live Food Database</h3>
                        <span className="card-badge green">MySQL-backed</span>
                    </div>
                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Food Name</th>
                                    <th>Category</th>
                                    <th>Diet Type</th>
                                    <th>Calories</th>
                                    <th>Protein</th>
                                    <th>Carbs</th>
                                    <th>Fat</th>
                                    <th>Iron</th>
                                    <th>Calcium</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFoods.map((food) => (
                                    <tr key={food.id}>
                                        <td><strong>{food.name}</strong></td>
                                        <td><span className={`category-tag ${(food.category || 'general').toLowerCase()}`}>{food.category || 'General'}</span></td>
                                        <td><span className={`category-tag ${(food.dietType || 'veg').toLowerCase()}`}>{(food.dietType || 'veg').toUpperCase()}</span></td>
                                        <td>{food.calories} kcal</td>
                                        <td>{food.protein}g</td>
                                        <td>{food.carbs}g</td>
                                        <td>{food.fat}g</td>
                                        <td>{food.iron}mg</td>
                                        <td>{food.calcium}mg</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn" title="Edit" onClick={() => openEditModal(food)}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button className="action-btn delete" title="Delete" onClick={() => handleDelete(food.id)}>
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

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <form className="modal-form" onSubmit={handleSubmit}>
                                <div>
                                    <label>Food Name</label>
                                    <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g., Quinoa" required />
                                </div>
                                <div>
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} required>
                                        <option value="">Select category</option>
                                        <option value="Fruit">Fruit</option>
                                        <option value="Vegetable">Vegetable</option>
                                        <option value="Protein">Protein</option>
                                        <option value="Grain">Grain</option>
                                        <option value="Dairy">Dairy</option>
                                        <option value="Nuts">Nuts</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Diet Type</label>
                                    <select name="dietType" value={formData.dietType} onChange={handleChange} required>
                                        <option value="veg">Veg</option>
                                        <option value="nonveg">Non-Veg</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div><label>Calories (kcal)</label><input name="calories" type="number" value={formData.calories} onChange={handleChange} placeholder="0" required /></div>
                                    <div><label>Protein (g)</label><input name="protein" type="number" value={formData.protein} onChange={handleChange} placeholder="0" /></div>
                                    <div><label>Carbs (g)</label><input name="carbs" type="number" value={formData.carbs} onChange={handleChange} placeholder="0" /></div>
                                    <div><label>Fat (g)</label><input name="fat" type="number" value={formData.fat} onChange={handleChange} placeholder="0" /></div>
                                    <div><label>Iron (mg)</label><input name="iron" type="number" value={formData.iron} onChange={handleChange} placeholder="0" /></div>
                                    <div><label>Calcium (mg)</label><input name="calcium" type="number" value={formData.calcium} onChange={handleChange} placeholder="0" /></div>
                                    <div><label>Vit C (mg)</label><input name="vitC" type="number" value={formData.vitC} onChange={handleChange} placeholder="0" /></div>
                                    <div><label>Vit D (mg)</label><input name="vitD" type="number" value={formData.vitD} onChange={handleChange} placeholder="0" /></div>
                                    <div><label>Fiber (g)</label><input name="fiber" type="number" value={formData.fiber} onChange={handleChange} placeholder="0" /></div>
                                    <div><label>Vit B12 (mg)</label><input name="vitB12" type="number" value={formData.vitB12} onChange={handleChange} placeholder="0" /></div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : (editingFood ? 'Update Food' : 'Add Food')}</button>
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
