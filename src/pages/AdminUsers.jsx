import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminUsers = () => {
    const users = [
        { id: 1, name: 'Priya Sharma', email: 'priya@email.com', age: 14, gender: 'Female', bmi: 21.3, calories: 1850, steps: 8400, deficiencies: ['Vitamin D'], status: 'Active', joined: '2026-01-15' },
        { id: 2, name: 'Rahul Patel', email: 'rahul@email.com', age: 28, gender: 'Male', bmi: 24.8, calories: 2100, steps: 6200, deficiencies: ['Iron'], status: 'Active', joined: '2026-01-20' },
        { id: 3, name: 'Anita Verma', email: 'anita@email.com', age: 10, gender: 'Female', bmi: 18.2, calories: 1500, steps: 9800, deficiencies: ['Calcium', 'Vit D'], status: 'New', joined: '2026-02-10' },
        { id: 4, name: 'Vikram Singh', email: 'vikram@email.com', age: 35, gender: 'Male', bmi: 27.1, calories: 2200, steps: 4500, deficiencies: [], status: 'Active', joined: '2025-12-05' },
        { id: 5, name: 'Sneha Joshi', email: 'sneha@email.com', age: 16, gender: 'Female', bmi: 20.1, calories: 1700, steps: 7100, deficiencies: ['Iron', 'B12'], status: 'Active', joined: '2026-02-01' },
        { id: 6, name: 'Arjun Kumar', email: 'arjun@email.com', age: 22, gender: 'Male', bmi: 22.5, calories: 1900, steps: 11200, deficiencies: [], status: 'Active', joined: '2026-01-08' },
    ];

    return (
        <div className="dashboard-page">
            <Navbar variant="admin" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>User <span className="gradient-text-purple">Management</span></h1>
                        <p>Monitor user health records and manage accounts</p>
                    </div>
                </div>

                <div className="stats-grid" style={{ marginBottom: '24px' }}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>👥</div>
                        <div className="stat-info"><span className="stat-number">{users.length}</span><span className="stat-desc">Total Users</span></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>🧒</div>
                        <div className="stat-info"><span className="stat-number">{users.filter(u => u.age < 18).length}</span><span className="stat-desc">Children & Teens</span></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>⚠️</div>
                        <div className="stat-info"><span className="stat-number">{users.filter(u => u.deficiencies.length > 0).length}</span><span className="stat-desc">With Deficiencies</span></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>✨</div>
                        <div className="stat-info"><span className="stat-number">{users.filter(u => u.status === 'New').length}</span><span className="stat-desc">New This Month</span></div>
                    </div>
                </div>

                <div className="dash-card" style={{ gridColumn: 'span 3' }}>
                    <div className="card-header">
                        <h3>All Users</h3>
                    </div>
                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Age/Gender</th>
                                    <th>BMI</th>
                                    <th>Calories</th>
                                    <th>Steps</th>
                                    <th>Deficiencies</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="user-detail-avatar" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                                                    {u.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <strong>{u.name}</strong>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{u.age} / {u.gender}</td>
                                        <td><span style={{ color: u.bmi < 18.5 || u.bmi > 25 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>{u.bmi}</span></td>
                                        <td>{u.calories} kcal</td>
                                        <td>{u.steps.toLocaleString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                {u.deficiencies.length > 0 ? u.deficiencies.map((d, j) => (
                                                    <span key={j} className="vit-tag" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>{d}</span>
                                                )) : <span style={{ fontSize: '0.7rem', color: '#22c55e' }}>✓ None</span>}
                                            </div>
                                        </td>
                                        <td><span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span></td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn" title="View Details">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                </button>
                                                <button className="action-btn" title="Message">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
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
        </div>
    );
};

export default AdminUsers;
