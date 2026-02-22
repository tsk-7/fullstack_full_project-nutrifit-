import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useNutrition } from '../context/NutritionContext';
import './Dashboard.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { loggedInDoctor, logoutDoctor, chatMessages, users } = useNutrition();

    if (!loggedInDoctor) {
        navigate('/doctor-login');
        return null;
    }

    // Helper to get user name from email
    const getUserName = (email) => {
        const user = users.find(u => u.email === email);
        return user?.name || email;
    };

    // Get all conversations for this doctor
    const doctorConversations = Object.entries(chatMessages)
        .filter(([key]) => key.includes(`doctor_${loggedInDoctor.id}`))
        .map(([key, messages]) => {
            const userEmail = key.split('_doctor_')[0].replace('user_', '');
            const userName = getUserName(userEmail);
            return {
                userEmail,
                userName,
                messages,
                lastMessage: messages[messages.length - 1],
                unread: messages.filter(m => m.from === 'user' && !m.read).length
            };
        });

    const handleLogout = () => {
        logoutDoctor();
        navigate('/');
    };

    const stats = [
        { icon: '💬', value: doctorConversations.length, label: 'Active Chats', color: '#22c55e' },
        { icon: '⭐', value: loggedInDoctor.rating || 0, label: 'Rating', color: '#f59e0b' },
        { icon: '👥', value: loggedInDoctor.totalRatings || 0, label: 'Total Reviews', color: '#06b6d4' },
        { icon: '✅', value: 'Active', label: 'Status', color: '#8b5cf6' },
    ];

    return (
        <div className="dashboard-page">
            <Navbar variant="doctor" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome, <span className="gradient-text">{loggedInDoctor.name}!</span></h1>
                        <p>{loggedInDoctor.specialty} • {loggedInDoctor.experience} experience</p>
                    </div>
                    <button className="btn-secondary" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                        Logout
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-card">
                            <div className="stat-icon" style={{ background: `${s.color}1a`, color: s.color }}>{s.icon}</div>
                            <div className="stat-info">
                                <span className="stat-number">{s.value}</span>
                                <span className="stat-desc">{s.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Conversations */}
                <div className="dash-card">
                    <div className="card-header">
                        <h3>Patient Conversations</h3>
                        <span className="card-badge green">{doctorConversations.length} active</span>
                    </div>
                    
                    {doctorConversations.length === 0 ? (
                        <div className="empty-state">
                            <p>No conversations yet. Patients will appear here when they message you.</p>
                        </div>
                    ) : (
                        <div className="conversation-list">
                            {doctorConversations.map((conv, i) => (
                                <div key={i} className="conversation-item" onClick={() => navigate('/doctor-messages')}>
                                    <div className="conv-avatar">
                                        {conv.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="conv-info">
                                        <div className="conv-name">{conv.userName}</div>
                                        <div className="conv-preview">{conv.lastMessage?.text?.slice(0, 50)}...</div>
                                    </div>
                                    <div className="conv-meta">
                                        <span className="conv-time">{conv.lastMessage?.time}</span>
                                        {conv.unread > 0 && <span className="conv-badge">{conv.unread}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
