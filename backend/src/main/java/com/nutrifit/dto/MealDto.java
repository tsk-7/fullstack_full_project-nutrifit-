package com.nutrifit.dto;

public class MealDto {
    private Long id;
    private String name;
    private String mealTime;
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double iron;
    private Double calcium;
    private Double vitC;
    private Double vitD;
    private Double fiber;
    private Double vitB12;
    private String consumedOn;

    public MealDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getConsumedOn() { return consumedOn; }
    public void setConsumedOn(String consumedOn) { this.consumedOn = consumedOn; }
}
