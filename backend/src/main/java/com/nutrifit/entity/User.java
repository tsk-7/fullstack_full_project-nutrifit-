package com.nutrifit.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 120)
    private String name;
    
    @Column(nullable = false, unique = true, length = 191)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    private Integer age;
    
    @Column(length = 30)
    private String gender;
    
    private Double height;
    
    private Double weight;
    
    @Column(name = "date_of_birth")
    private String dateOfBirth;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @Column(name = "profile_complete", nullable = false)
    private Boolean profileComplete;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (profileComplete == null) {
            profileComplete = false;
        }
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

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public Boolean getProfileComplete() { return profileComplete; }
    public void setProfileComplete(Boolean profileComplete) { this.profileComplete = profileComplete; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum UserRole {
        USER, ADMIN
    }
}
