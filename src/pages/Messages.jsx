import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNutrition } from '../context/NutritionContext';
import './Messages.css';

const Messages = () => {
    const { getSortedDoctors, currentDoctor, setCurrentDoctor, sendMessage, getMessages, rateMessage, userProfile } = useNutrition();
    const [newMessage, setNewMessage] = useState('');
    const [ratingModal, setRatingModal] = useState({ show: false, messageId: null });
    const [selectedRating, setSelectedRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const doctors = getSortedDoctors();
    const messages = currentDoctor ? getMessages(currentDoctor.id) : [];

    const handleSendMessage = () => {
        if (newMessage.trim() && currentDoctor) {
            sendMessage(currentDoctor.id, newMessage, true);
            setNewMessage('');
            // Simulate doctor reply after a short delay
            setTimeout(() => {
                const replies = [
                    "Thank you for your question! I'll review your details and get back to you shortly.",
                    "That's a great question about nutrition. Let me provide some guidance.",
                    "I understand your concern. Here's what I recommend based on your profile.",
                    "Based on your dietary needs, I suggest focusing on balanced meals throughout the day.",
                    "I've noted your query. Let's work together to improve your nutrition goals!"
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                sendMessage(currentDoctor.id, randomReply, false);
            }, 1500);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    };

    const openRatingModal = (messageId) => {
        setRatingModal({ show: true, messageId });
        setSelectedRating(0);
        setFeedback('');
    };

    const submitRating = () => {
        if (selectedRating > 0 && currentDoctor) {
            rateMessage(currentDoctor.id, ratingModal.messageId, selectedRating, feedback);
            setRatingModal({ show: false, messageId: null });
        }
    };

    const renderStars = (rating, interactive = false, size = 'small') => {
        return (
            <div className={`star-rating ${size}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
                        onClick={() => interactive && setSelectedRating(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="dashboard-page">
            <Navbar variant="user" />
            <div className="dashboard-container container">
                <div className="dashboard-header">
                    <div>
                        <h1>Expert <span className="gradient-text">Consultation</span></h1>
                        <p>Connect with top-rated nutrition doctors for personalized advice</p>
                    </div>
                </div>

                <div className="messages-layout">
                    {/* Doctor List Sidebar */}
                    <div className="msg-sidebar">
                        <div className="msg-sidebar-header">
                            <h3>Top Doctors</h3>
                            <span className="doctor-count">{doctors.length} available</span>
                        </div>
                        <div className="doctor-list">
                            {doctors.map((doctor) => (
                                <div 
                                    key={doctor.id} 
                                    className={`msg-contact doctor-card ${currentDoctor?.id === doctor.id ? 'active' : ''}`}
                                    onClick={() => setCurrentDoctor(doctor)}
                                >
                                    <div className="contact-avatar doctor-av">{doctor.avatar}</div>
                                    <div className="contact-info">
                                        <div className="contact-name">{doctor.name}</div>
                                        <div className="contact-specialty">{doctor.specialty}</div>
                                        <div className="contact-rating">
                                            {renderStars(Math.round(doctor.rating))}
                                            <span className="rating-text">{doctor.rating} ({doctor.totalRatings})</span>
                                        </div>
                                    </div>
                                    <div className={`availability-badge ${doctor.available ? 'online' : 'offline'}`}>
                                        {doctor.available ? 'Online' : 'Away'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="msg-chat">
                        {!currentDoctor ? (
                            <div className="no-doctor-selected">
                                <div className="empty-chat-icon">👨‍⚕️</div>
                                <h3>Select a Doctor</h3>
                                <p>Choose a nutrition expert from the list to start your consultation</p>
                            </div>
                        ) : (
                            <>
                                <div className="chat-header">
                                    <div className="chat-user">
                                        <div className="contact-avatar doctor-av">{currentDoctor.avatar}</div>
                                        <div>
                                            <div className="chat-name">{currentDoctor.name}</div>
                                            <div className="chat-status">
                                                <span className={`online-dot ${currentDoctor.available ? '' : 'offline'}`}></span>
                                                {currentDoctor.available ? 'Online' : 'Away'} • {currentDoctor.specialty}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="doctor-stats">
                                        {renderStars(Math.round(currentDoctor.rating))}
                                        <span>{currentDoctor.rating} rating</span>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {messages.length === 0 ? (
                                        <div className="empty-messages">
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div key={msg.id} className={`chat-msg ${msg.from}`}>
                                                <div className="msg-bubble">
                                                    <p>{msg.text}</p>
                                                    <span className="msg-time">{msg.time}</span>
                                                </div>
                                                {msg.from === 'doctor' && !msg.rated && (
                                                    <button 
                                                        className="rate-btn"
                                                        onClick={() => openRatingModal(msg.id)}
                                                    >
                                                        ⭐ Rate this response
                                                    </button>
                                                )}
                                                {msg.from === 'doctor' && msg.rated && (
                                                    <div className="rated-badge">
                                                        {renderStars(msg.rating)} 
                                                        <span>Rated</span>
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
                                        placeholder="Type your question..."
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

            {/* Rating Modal */}
            {ratingModal.show && (
                <div className="rating-modal-overlay" onClick={() => setRatingModal({ show: false, messageId: null })}>
                    <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Rate this response</h3>
                        <p>How helpful was the doctor's response?</p>
                        
                        <div className="rating-stars-container">
                            {renderStars(selectedRating, true, 'large')}
                        </div>
                        
                        <textarea
                            className="feedback-input"
                            placeholder="Add your feedback (optional)..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="3"
                        />
                        
                        <div className="rating-modal-actions">
                            <button className="btn-secondary" onClick={() => setRatingModal({ show: false, messageId: null })}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={submitRating} disabled={selectedRating === 0}>
                                Submit Rating
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
