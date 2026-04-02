import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState(null);
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

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                setLoading(true);
                setError('');
                const [statsRes, usersRes] = await Promise.all([
                    fetch('http://localhost:5000/api/admin/stats', { headers: authHeaders }),
                    fetch('http://localhost:5000/api/users', { headers: authHeaders })
                ]);

                if (!statsRes.ok || !usersRes.ok) {
                    const statsErr = await statsRes.json().catch(() => ({}));
                    const usersErr = await usersRes.json().catch(() => ({}));
                    throw new Error(statsErr.message || usersErr.message || 'Failed to load admin data');
                }

                const statsJson = await statsRes.json();
                const usersJson = await usersRes.json();
                setStatsData(statsJson);
                setUsers(Array.isArray(usersJson) ? usersJson : []);
            } catch (err) {
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, []);

    const stats = [
        { icon: '👥', value: statsData?.totalUsers ?? 0, label: 'Total Users', trend: 'Live', up: true, color: '#22c55e' },
        { icon: '🍽️', value: statsData?.totalMeals ?? 0, label: 'Total Meals Logged', trend: 'Live', up: true, color: '#06b6d4' },
        { icon: '🩺', value: statsData?.totalDoctors ?? 0, label: 'Total Doctors', trend: 'Live', up: true, color: '#8b5cf6' },
        { icon: '💬', value: statsData?.totalMessages ?? 0, label: 'Total Messages', trend: 'Live', up: true, color: '#f59e0b' },
    ];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const userGrowth = monthNames.map((month, idx) => ({
        month,
        users: users.filter((u) => u.createdAt && new Date(u.createdAt).getMonth() <= idx).length
    }));

    const ageGroups = [
        { name: '5-12', value: users.filter((u) => (u.age || 0) >= 5 && (u.age || 0) <= 12).length, color: '#22c55e' },
        { name: '13-18', value: users.filter((u) => (u.age || 0) >= 13 && (u.age || 0) <= 18).length, color: '#06b6d4' },
        { name: '19-30', value: users.filter((u) => (u.age || 0) >= 19 && (u.age || 0) <= 30).length, color: '#8b5cf6' },
        { name: '30+', value: users.filter((u) => (u.age || 0) > 30).length, color: '#f59e0b' },
    ];

    const topDeficiencies = [
        { nutrient: 'Vitamin D', count: 892, percent: 31 },
        { nutrient: 'Iron', count: 756, percent: 27 },
        { nutrient: 'Calcium', count: 623, percent: 22 },
        { nutrient: 'Vitamin B12', count: 451, percent: 16 },
        { nutrient: 'Fiber', count: 389, percent: 14 },
    ];

    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 6)
        .map((u) => ({
            name: u.name || 'Unnamed User',
            email: u.email,
            age: u.age || '-',
            bmi: '-',
            status: u.profileComplete ? 'Active' : 'New'
        }));

    return (
        <div className="dashboard-page">
            <Navbar variant="admin" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Admin <span className="gradient-text-purple">Dashboard</span></h1>
                        <p>Manage users, food database, and monitor platform health</p>
                    </div>
                </div>

                {loading && <div className="dash-card" style={{ padding: '16px' }}>Loading dashboard...</div>}
                {error && <div className="dash-card" style={{ padding: '16px', color: '#ef4444' }}>{error}</div>}

                {/* Admin Stats */}
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
                    {/* User Growth */}
                    <div className="dash-card span-2">
                        <div className="card-header">
                            <h3>User Growth</h3>
                            <span className="card-badge green">Last 6 months</span>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Age Distribution */}
                    <div className="dash-card">
                        <div className="card-header">
                            <h3>Age Distribution</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={ageGroups} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                                    {ageGroups.map((a, i) => <Cell key={i} fill={a.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="age-legend">
                            {ageGroups.map((a, i) => (
                                <div key={i} className="age-item">
                                    <span className="age-dot" style={{ background: a.color }}></span>
                                    <span>{a.name} yrs</span>
                                    <strong>{a.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Deficiencies */}
                    <div className="dash-card">
                        <div className="card-header">
                            <h3>Common Deficiencies</h3>
                        </div>
                        <div className="deficiency-bars">
                            {topDeficiencies.map((d, i) => (
                                <div key={i} className="def-bar-item">
                                    <div className="def-bar-header">
                                        <span>{d.nutrient}</span>
                                        <span className="def-count">{d.count} users ({d.percent}%)</span>
                                    </div>
                                    <div className="def-bar-track">
                                        <div className="def-bar-fill" style={{ width: `${d.percent * 3}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="dash-card span-2">
                        <div className="card-header">
                            <h3>Recent Users</h3>
                            <Link to="/admin/users" className="card-link">View All →</Link>
                        </div>
                        <div className="admin-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Age</th>
                                        <th>BMI</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((u, i) => (
                                        <tr key={i}>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.email}</td>
                                            <td>{u.age}</td>
                                            <td>{u.bmi}</td>
                                            <td><span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
