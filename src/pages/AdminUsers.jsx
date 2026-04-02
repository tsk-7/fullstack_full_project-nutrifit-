import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const authHeaders = useMemo(() => {
        try {
            const tokenRaw = localStorage.getItem('nutrifit_token');
            const token = tokenRaw ? JSON.parse(tokenRaw) : null;
            return token ? { Authorization: `Bearer ${token}` } : {};
        } catch {
            return {};
        }
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('http://localhost:5000/api/users', { headers: authHeaders });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || errData.error || `Failed to load users (${response.status})`);
            }
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: authHeaders
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || errData.error || `Failed to delete user (${response.status})`);
            }
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            alert(`❌ ${err.message || 'Failed to delete user'}`);
        }
    };

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
                        <div className="stat-info"><span className="stat-number">{users.filter(u => (u.age || 0) < 18).length}</span><span className="stat-desc">Children & Teens</span></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>⚠️</div>
                        <div className="stat-info"><span className="stat-number">{users.filter(u => !u.profileComplete).length}</span><span className="stat-desc">Incomplete Profiles</span></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>✨</div>
                        <div className="stat-info"><span className="stat-number">{users.filter(u => u.createdAt && new Date(u.createdAt).getMonth() === new Date().getMonth()).length}</span><span className="stat-desc">New This Month</span></div>
                    </div>
                </div>

                {loading && <div className="dash-card" style={{ padding: '16px' }}>Loading users...</div>}
                {error && <div className="dash-card" style={{ padding: '16px', color: '#ef4444' }}>{error}</div>}

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
                                                    {(u.name || 'U').split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <strong>{u.name || 'Unnamed User'}</strong>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{u.age || '-'} / {u.gender || '-'}</td>
                                        <td><span style={{ color: '#64748b', fontWeight: 600 }}>-</span></td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>
                                            <span style={{ fontSize: '0.75rem', color: u.profileComplete ? '#22c55e' : '#f59e0b' }}>
                                                {u.profileComplete ? 'Complete' : 'Incomplete'}
                                            </span>
                                        </td>
                                        <td><span className={`status-badge ${u.profileComplete ? 'active' : 'new'}`}>{u.profileComplete ? 'Active' : 'New'}</span></td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn" title="View Details" disabled>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                </button>
                                                <button className="action-btn delete" title="Delete User" onClick={() => handleDelete(u.id)}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
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
