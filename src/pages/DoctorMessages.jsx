import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useNutrition } from '../context/NutritionContext';
import './Messages.css';

const DoctorMessages = () => {
    const navigate = useNavigate();
    const { loggedInDoctor, chatMessages, users, sendDoctorMessage } = useNutrition();
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    if (!loggedInDoctor) {
        navigate('/doctor-login');
        return null;
    }

    // Helper to get user details from email
    const getUserDetails = (email) => {
        const user = users.find(u => u.email === email);
        return {
            name: user?.name || email,
            avatar: user?.name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()
        };
    };

    // Get all users who have messaged this doctor
    const userConversations = Object.entries(chatMessages)
        .filter(([key]) => key.includes(`doctor_${loggedInDoctor.id}`))
        .map(([key, messages]) => {
            const userEmail = key.split('_doctor_')[0].replace('user_', '');
            const userDetails = getUserDetails(userEmail);
            return {
                key,
                userEmail,
                userName: userDetails.name,
                avatar: userDetails.avatar,
                messages,
                lastMessage: messages[messages.length - 1],
                unread: messages.filter(m => m.from === 'user' && !m.read).length
            };
        })
        .sort((a, b) => {
            // Sort by last message time, most recent first
            const timeA = a.messages[a.messages.length - 1]?.id || 0;
            const timeB = b.messages[b.messages.length - 1]?.id || 0;
            return timeB - timeA;
        });

    const currentMessages = selectedUser 
        ? chatMessages[selectedUser.key] || []
        : [];

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedUser) {
            sendDoctorMessage(loggedInDoctor.id, selectedUser.userEmail, newMessage);
            setNewMessage('');
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
                                    <p>No patient messages yet</p>
                                </div>
                            ) : (
                                userConversations.map((conv) => (
                                    <div 
                                        key={conv.key} 
                                        className={`msg-contact doctor-card ${selectedUser?.key === conv.key ? 'active' : ''}`}
                                        onClick={() => setSelectedUser(conv)}
                                    >
                                        <div className="contact-avatar">{conv.avatar}</div>
                                        <div className="contact-info">
                                            <div className="contact-name">{conv.userName}</div>
                                            <div className="contact-preview">{conv.lastMessage?.text?.slice(0, 30)}...</div>
                                        </div>
                                        <div className="conv-meta">
                                            <span className="conv-time">{conv.lastMessage?.time}</span>
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
                                                    <span className="msg-time">{msg.time}</span>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorMessages;
