import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../services/api';
import './Messages.css';

const AdminMessages = () => {
    const [selectedConversation, setSelectedConversation] = useState('');
    const [allMessages, setAllMessages] = useState([]);
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

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError('');
                const response = await fetch(`${API_BASE_URL}/messages/admin/all`, {
                headers: authHeaders
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || errData.error || `Failed to load messages (${response.status})`);
            }
            const data = await response.json();
            setAllMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const conversations = useMemo(() => {
        const grouped = new Map();
        for (const msg of allMessages) {
            const key = String(msg.conversationId);
            if (!grouped.has(key)) {
                grouped.set(key, {
                    id: key,
                    name: msg.userName || `User ${msg.userId}`,
                    avatar: (msg.userName || 'U').slice(0, 2).toUpperCase(),
                    doctorName: msg.doctorName || 'Doctor',
                    messages: []
                });
            }
            grouped.get(key).messages.push({
                id: msg.id,
                from: msg.senderType === 'doctor' ? 'admin' : 'user',
                text: msg.text,
                createdAt: msg.createdAt ? new Date(msg.createdAt).getTime() : 0,
                time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'
            });
        }

        return Array.from(grouped.values())
            .map((conv) => ({
                ...conv,
                messages: [...conv.messages].sort((a, b) => a.createdAt - b.createdAt)
            }))
            .map((conv) => ({
                ...conv,
                lastMsg: conv.messages[conv.messages.length - 1]?.text || '',
                lastTime: conv.messages[conv.messages.length - 1]?.time || '-'
            }))
            .sort((a, b) => (a.messages[a.messages.length - 1]?.id || 0) < (b.messages[b.messages.length - 1]?.id || 0) ? 1 : -1);
    }, [allMessages]);

    useEffect(() => {
        if (!selectedConversation && conversations.length > 0) {
            setSelectedConversation(conversations[0].id);
        }
    }, [conversations, selectedConversation]);

    const currentConversation = conversations.find((c) => c.id === selectedConversation);

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

                {loading && <div className="dash-card" style={{ padding: '16px' }}>Loading admin messages...</div>}
                {error && <div className="dash-card" style={{ padding: '16px', color: '#ef4444' }}>{error}</div>}

                <div className="messages-layout">
                    <div className="msg-sidebar">
                        <div className="msg-sidebar-header">
                            <h3>User Conversations</h3>
                        </div>
                        {conversations.map((c) => (
                            <div key={c.id} className={`msg-contact ${selectedConversation === c.id ? 'active' : ''}`} onClick={() => setSelectedConversation(c.id)}>
                                <div className="contact-avatar">{c.avatar}</div>
                                <div className="contact-info">
                                    <div className="contact-name">{c.name}</div>
                                    <div className="contact-preview">{c.lastMsg}</div>
                                </div>
                                <div className="contact-time">{c.lastTime}</div>
                            </div>
                        ))}
                    </div>

                    <div className="msg-chat">
                        {!currentConversation ? (
                            <div className="no-doctor-selected">
                                <div className="empty-chat-icon">📭</div>
                                <h3>No Conversation Selected</h3>
                                <p>Select a conversation to view message history</p>
                            </div>
                        ) : (
                            <>
                        <div className="chat-header">
                            <div className="chat-user">
                                <div className="contact-avatar">{currentConversation.avatar}</div>
                                <div>
                                    <div className="chat-name">{currentConversation.name}</div>
                                    <div className="chat-status"><span className="online-dot"></span> Doctor: {currentConversation.doctorName}</div>
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
                            <div style={{ width: '100%', color: '#64748b', fontSize: '0.9rem', padding: '8px 0' }}>
                                Read-only conversation history. Admin broadcast/reply APIs can be added if required.
                            </div>
                        </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
