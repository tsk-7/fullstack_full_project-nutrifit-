package com.nutrifit.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "meals", indexes = {
    @Index(name = "idx_meals_user_date", columnList = "user_id, consumed_on")
})
public class Meal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;
    
    @Column(nullable = false, length = 120)
    private String name;
    
    @Column(name = "meal_time", length = 30)
    private String mealTime;
    
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
    
    @Column(name = "consumed_on", nullable = false)
    private LocalDate consumedOn;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (consumedOn == null) {
            consumedOn = LocalDate.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Food getFood() { return food; }
    public void setFood(Food food) { this.food = food; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMealTime() { return mealTime; }
    public void setMealTime(String mealTime) { this.mealTime = mealTime; }

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

    public LocalDate getConsumedOn() { return consumedOn; }
    public void setConsumedOn(LocalDate consumedOn) { this.consumedOn = consumedOn; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
