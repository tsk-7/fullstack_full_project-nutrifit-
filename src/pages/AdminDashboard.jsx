import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const stats = [
        { icon: '👥', value: '2,847', label: 'Total Users', trend: '+12.5%', up: true, color: '#22c55e' },
        { icon: '🍽️', value: '156', label: 'Food Items', trend: '+3.2%', up: true, color: '#06b6d4' },
        { icon: '📋', value: '42', label: 'Diet Plans', trend: '+8.1%', up: true, color: '#8b5cf6' },
        { icon: '💬', value: '18', label: 'Pending Msgs', trend: '-5.3%', up: false, color: '#f59e0b' },
    ];

    const userGrowth = [
        { month: 'Jan', users: 800 }, { month: 'Feb', users: 1200 },
        { month: 'Mar', users: 1500 }, { month: 'Apr', users: 1800 },
        { month: 'May', users: 2200 }, { month: 'Jun', users: 2847 },
    ];

    const ageGroups = [
        { name: '5-12', value: 25, color: '#22c55e' },
        { name: '13-18', value: 35, color: '#06b6d4' },
        { name: '19-30', value: 25, color: '#8b5cf6' },
        { name: '30+', value: 15, color: '#f59e0b' },
    ];

    const topDeficiencies = [
        { nutrient: 'Vitamin D', count: 892, percent: 31 },
        { nutrient: 'Iron', count: 756, percent: 27 },
        { nutrient: 'Calcium', count: 623, percent: 22 },
        { nutrient: 'Vitamin B12', count: 451, percent: 16 },
        { nutrient: 'Fiber', count: 389, percent: 14 },
    ];

    const recentUsers = [
        { name: 'Priya Sharma', email: 'priya@email.com', age: 14, bmi: 21.3, status: 'Active' },
        { name: 'Rahul Patel', email: 'rahul@email.com', age: 28, bmi: 24.8, status: 'Active' },
        { name: 'Anita Verma', email: 'anita@email.com', age: 10, bmi: 18.2, status: 'New' },
        { name: 'Vikram Singh', email: 'vikram@email.com', age: 35, bmi: 27.1, status: 'Active' },
    ];

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
                                    <strong>{a.value}%</strong>
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
                            <a href="/admin/users" className="card-link">View All →</a>
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
