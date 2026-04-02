import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useNutrition } from '../context/NutritionContext';
import './Messages.css';

const DoctorMessages = () => {
    const navigate = useNavigate();
    const {
        loggedInDoctor,
        doctorId,
        sendDoctorMessage,
        getDoctorInbox,
        getDoctorConversation,
        getDoctorUserDaywiseReport,
        error: contextError
    } = useNutrition();
    const [userConversations, setUserConversations] = useState([]);
    const [currentMessages, setCurrentMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [daywiseReport, setDaywiseReport] = useState([]);

    if (!loggedInDoctor) {
        navigate('/doctor-login');
        return null;
    }

    useEffect(() => {
        const loadInbox = async () => {
            if (!doctorId) return;
            setLoading(true);
            const inbox = await getDoctorInbox();
            const mapped = inbox.map((item) => ({
                userId: item.userId,
                userName: item.userName || item.userEmail || `User ${item.userId}`,
                avatar: (item.userName || item.userEmail || 'U').slice(0, 2).toUpperCase(),
                lastMessage: item.lastMessage || '',
                time: item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
                rawTime: item.lastMessageAt || '',
                unread: 0
            }));
            setUserConversations(mapped);
            setLoading(false);
        };

        loadInbox();
    }, [doctorId]);

    useEffect(() => {
        const loadConversation = async () => {
            if (!selectedUser?.userId) {
                setCurrentMessages([]);
                return;
            }
            setLoading(true);
            const conversation = await getDoctorConversation(selectedUser.userId);
            setCurrentMessages(conversation);
            const reports = await getDoctorUserDaywiseReport(selectedUser.userId, fromDate, toDate);
            setDaywiseReport(reports);
            setLoading(false);
        };

        loadConversation();
    }, [selectedUser?.userId, fromDate, toDate]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedUser) {
            const success = await sendDoctorMessage(loggedInDoctor.id, selectedUser.userId, newMessage);
            if (success) {
                setNewMessage('');
                const conversation = await getDoctorConversation(selectedUser.userId);
                setCurrentMessages(conversation);
            } else {
                alert(`❌ Failed to send message: ${contextError || 'Unknown error'}`);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
            handleSendMessage(); 
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar variant="doctor" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Patient <span className="gradient-text">Messages</span></h1>
                        <p>Respond to your patients' nutrition queries</p>
                    </div>
                </div>

                <div className="messages-layout">
                    {/* User List Sidebar */}
                    <div className="msg-sidebar">
                        <div className="msg-sidebar-header">
                            <h3>Patients</h3>
                            <span className="doctor-count">{userConversations.length} conversations</span>
                        </div>
                        <div className="doctor-list">
                            {userConversations.length === 0 ? (
                                <div className="no-conversations">
                                    <p>{loading ? 'Loading conversations...' : 'No patient messages yet'}</p>
                                </div>
                            ) : (
                                userConversations.map((conv) => (
                                    <div 
                                        key={conv.userId}
                                        className={`msg-contact doctor-card ${selectedUser?.userId === conv.userId ? 'active' : ''}`}
                                        onClick={() => setSelectedUser(conv)}
                                    >
                                        <div className="contact-avatar">{conv.avatar}</div>
                                        <div className="contact-info">
                                            <div className="contact-name">{conv.userName}</div>
                                            <div className="contact-preview">{(conv.lastMessage || '').slice(0, 40) || 'No messages yet'}</div>
                                        </div>
                                        <div className="conv-meta">
                                            <span className="conv-time">{conv.time}</span>
                                            {conv.unread > 0 && <span className="conv-badge">{conv.unread}</span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="msg-chat">
                        {!selectedUser ? (
                            <div className="no-doctor-selected">
                                <div className="empty-chat-icon">👤</div>
                                <h3>Select a Patient</h3>
                                <p>Choose a patient from the list to view and respond to their messages</p>
                            </div>
                        ) : (
                            <>
                                <div className="chat-header">
                                    <div className="chat-user">
                                        <div className="contact-avatar">{selectedUser.avatar}</div>
                                        <div>
                                            <div className="chat-name">{selectedUser.userName}</div>
                                            <div className="chat-status">
                                                <span className="online-dot"></span>
                                                Patient
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {currentMessages.length === 0 ? (
                                        <div className="empty-messages">
                                            <p>No messages yet</p>
                                        </div>
                                    ) : (
                                        currentMessages.map((msg) => (
                                            <div key={msg.id} className={`chat-msg ${msg.from === 'doctor' ? 'user' : 'doctor'}`}>
                                                <div className="msg-bubble">
                                                    <p>{msg.text}</p>
                                                    <span className="msg-time">{msg.time || '-'}</span>
                                                </div>
                                                {msg.from === 'doctor' && msg.rated && (
                                                    <div className="rated-badge">
                                                        <span className="star-rating small">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <span key={s} className={`star ${s <= msg.rating ? 'filled' : ''}`}>★</span>
                                                            ))}
                                                        </span>
                                                        <span>Patient rated</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="chat-input">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Type your response..."
                                        rows="1"
                                    />
                                    <button className="send-btn" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="dash-card" style={{ marginTop: '14px' }}>
                                    <div className="card-header">
                                        <h3>Day-to-Day Nutrition Report</h3>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                        <input type="date" className="food-select" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                                        <input type="date" className="food-select" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                                    </div>
                                    {daywiseReport.length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)' }}>No nutrition logs in this date range.</p>
                                    ) : (
                                        <div className="meals-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Meals</th>
                                                        <th>Calories</th>
                                                        <th>Protein</th>
                                                        <th>Carbs</th>
                                                        <th>Fat</th>
                                                        <th>Fiber</th>
                                                        <th>Water</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {daywiseReport.map((row) => (
                                                        <tr key={row.date}>
                                                            <td>{String(row.date).slice(0, 10)}</td>
                                                            <td>{row.mealsCount}</td>
                                                            <td>{row.calories}</td>
                                                            <td>{row.protein}g</td>
                                                            <td>{row.carbs}g</td>
                                                            <td>{row.fat}g</td>
                                                            <td>{row.fiber}g</td>
                                                            <td>{row.waterGlasses} glasses</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorMessages;
