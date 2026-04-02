package com.nutrifit.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_messages_conversation", columnList = "conversation_id, created_at"),
    @Index(name = "idx_messages_doctor_sender", columnList = "sender_doctor_id")
})
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;
    
    @Column(name = "sender_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private SenderType senderType;
    
    @ManyToOne
    @JoinColumn(name = "sender_user_id")
    private User senderUser;
    
    @ManyToOne
    @JoinColumn(name = "sender_doctor_id")
    private Doctor senderDoctor;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;
    
    @Column(nullable = false)
    private Boolean rated;
    
    @Column
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (rated == null) {
            rated = false;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Conversation getConversation() { return conversation; }
    public void setConversation(Conversation conversation) { this.conversation = conversation; }

    public SenderType getSenderType() { return senderType; }
    public void setSenderType(SenderType senderType) { this.senderType = senderType; }

    public User getSenderUser() { return senderUser; }
    public void setSenderUser(User senderUser) { this.senderUser = senderUser; }

    public Doctor getSenderDoctor() { return senderDoctor; }
    public void setSenderDoctor(Doctor senderDoctor) { this.senderDoctor = senderDoctor; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Boolean getRated() { return rated; }
    public void setRated(Boolean rated) { this.rated = rated; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum SenderType {
        USER, DOCTOR
    }
}
