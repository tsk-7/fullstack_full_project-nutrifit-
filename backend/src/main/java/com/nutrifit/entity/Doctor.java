package com.nutrifit.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
public class Doctor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 120)
    private String name;
    
    @Column(nullable = false, unique = true, length = 191)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Column(length = 120)
    private String specialty;
    
    @Column(name = "experience_years")
    private Integer experienceYears;
    
    @Column(nullable = false)
    private Double rating;
    
    @Column(name = "total_ratings", nullable = false)
    private Integer totalRatings;
    
    @Column(length = 4)
    private String avatar;
    
    @Column(nullable = false)
    private Boolean available;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (rating == null) rating = 0.0;
        if (totalRatings == null) totalRatings = 0;
        if (available == null) available = true;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Integer totalRatings) { this.totalRatings = totalRatings; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
