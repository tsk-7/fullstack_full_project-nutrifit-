import { useState } from 'react';
import Navbar from '../components/Navbar';
import './Messages.css';

const AdminMessages = () => {
    const [selectedUser, setSelectedUser] = useState(0);
    const [newMessage, setNewMessage] = useState('');

    const conversations = [
        {
            id: 0, name: 'Priya Sharma', avatar: 'PS', lastMsg: 'Should I give her supplements?', time: '11:00 AM', unread: 2,
            messages: [
                { id: 1, from: 'user', text: 'Hi! I need help creating a diet plan for my 10-year-old child.', time: '10:35 AM' },
                { id: 2, from: 'admin', text: 'I\'d be happy to help! Based on your child\'s profile, I can see the iron levels are below optimal. Let me create a customized plan.', time: '10:42 AM' },
                { id: 3, from: 'admin', text: 'I\'ve updated the diet plan in your dashboard with iron-rich foods.', time: '10:45 AM' },
                { id: 4, from: 'user', text: 'That\'s very helpful! Should I also give her supplements?', time: '11:00 AM' },
            ]
        },
        {
            id: 1, name: 'Rahul Patel', avatar: 'RP', lastMsg: 'Can you update my plan?', time: 'Yesterday', unread: 1,
            messages: [
                { id: 1, from: 'user', text: 'Hi, I want to adjust my diet plan for more protein. I started gym recently.', time: 'Yesterday' },
                { id: 2, from: 'admin', text: 'Sure! I\'ll add more protein-rich options to your plan.', time: 'Yesterday' },
                { id: 3, from: 'user', text: 'Can you update my plan for next week too?', time: 'Yesterday' },
            ]
        },
        {
            id: 2, name: 'Sneha Joshi', avatar: 'SJ', lastMsg: 'Thank you for the advice!', time: 'Feb 17', unread: 0,
            messages: [
                { id: 1, from: 'user', text: 'I have low iron and B12. What foods should I eat?', time: 'Feb 17' },
                { id: 2, from: 'admin', text: 'For iron, include spinach, lentils, and red meat. For B12, eat eggs, dairy, and fortified cereals.', time: 'Feb 17' },
                { id: 3, from: 'user', text: 'Thank you for the advice!', time: 'Feb 17' },
            ]
        },
    ];

    const currentConversation = conversations[selectedUser];

    const sendMessage = () => {
        if (newMessage.trim()) {
            currentConversation.messages.push({
                id: Date.now(),
                from: 'admin',
                text: newMessage,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            });
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <div className="dashboard-page">
            <Navbar variant="admin" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>User <span className="gradient-text-purple">Messages</span></h1>
                        <p>Respond to user queries and provide dietary advice</p>
                    </div>
                </div>

                <div className="messages-layout">
                    <div className="msg-sidebar">
                        <div className="msg-sidebar-header">
                            <h3>User Conversations</h3>
                        </div>
                        {conversations.map((c) => (
                            <div key={c.id} className={`msg-contact ${selectedUser === c.id ? 'active' : ''}`} onClick={() => setSelectedUser(c.id)}>
                                <div className="contact-avatar">{c.avatar}</div>
                                <div className="contact-info">
                                    <div className="contact-name">{c.name}</div>
                                    <div className="contact-preview">{c.lastMsg}</div>
                                </div>
                                <div className="contact-time">{c.time}</div>
                                {c.unread > 0 && <div className="contact-badge">{c.unread}</div>}
                            </div>
                        ))}
                    </div>

                    <div className="msg-chat">
                        <div className="chat-header">
                            <div className="chat-user">
                                <div className="contact-avatar">{currentConversation.avatar}</div>
                                <div>
                                    <div className="chat-name">{currentConversation.name}</div>
                                    <div className="chat-status"><span className="online-dot"></span> Online</div>
                                </div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {currentConversation.messages.map((msg) => (
                                <div key={msg.id} className={`chat-msg ${msg.from}`}>
                                    <div className="msg-bubble">
                                        <p>{msg.text}</p>
                                        <span className="msg-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="chat-input">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your response..."
                                rows="1"
                            />
                            <button className="send-btn" onClick={sendMessage}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
