package com.nutrifit.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "foods")
public class Food {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 120)
    private String name;
    
    @Column(length = 80)
    private String category;
    
    @Column(nullable = false)
    private Double calories;
    
    @Column(nullable = false)
    private Double protein;
    
    @Column(nullable = false)
    private Double carbs;
    
    @Column(nullable = false)
    private Double fat;
    
    @Column(nullable = false)
    private Double iron;
    
    @Column(nullable = false)
    private Double calcium;
    
    @Column(name = "vit_c", nullable = false)
    private Double vitC;
    
    @Column(name = "vit_d", nullable = false)
    private Double vitD;
    
    @Column(nullable = false)
    private Double fiber;
    
    @Column(name = "vit_b12", nullable = false)
    private Double vitB12;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
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

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getCalories() { return calories; }
    public void setCalories(Double calories) { this.calories = calories; }

    public Double getProtein() { return protein; }
    public void setProtein(Double protein) { this.protein = protein; }

    public Double getCarbs() { return carbs; }
    public void setCarbs(Double carbs) { this.carbs = carbs; }

    public Double getFat() { return fat; }
    public void setFat(Double fat) { this.fat = fat; }

    public Double getIron() { return iron; }
    public void setIron(Double iron) { this.iron = iron; }

    public Double getCalcium() { return calcium; }
    public void setCalcium(Double calcium) { this.calcium = calcium; }

    public Double getVitC() { return vitC; }
    public void setVitC(Double vitC) { this.vitC = vitC; }

    public Double getVitD() { return vitD; }
    public void setVitD(Double vitD) { this.vitD = vitD; }

    public Double getFiber() { return fiber; }
    public void setFiber(Double fiber) { this.fiber = fiber; }

    public Double getVitB12() { return vitB12; }
    public void setVitB12(Double vitB12) { this.vitB12 = vitB12; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
