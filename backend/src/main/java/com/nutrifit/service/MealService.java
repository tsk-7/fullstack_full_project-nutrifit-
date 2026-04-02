package com.nutrifit.service;

import com.nutrifit.dto.MealDto;
import com.nutrifit.entity.Meal;
import com.nutrifit.entity.User;
import com.nutrifit.repository.MealRepository;
import com.nutrifit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MealService {
    
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Meal> getMealsForToday(Long userId) {
        return mealRepository.findByUserAndDate(userId, LocalDate.now());
    }
    
    public List<Meal> getMealsForDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return mealRepository.findByUserAndDateRange(userId, startDate, endDate);
    }
    
    public Meal addMeal(Long userId, MealDto mealDto) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        
        Meal meal = new Meal();
        meal.setUser(userOpt.get());
        meal.setName(mealDto.getName());
        meal.setMealTime(mealDto.getMealTime());
        meal.setCalories(mealDto.getCalories() != null ? mealDto.getCalories() : 0.0);
        meal.setProtein(mealDto.getProtein() != null ? mealDto.getProtein() : 0.0);
        meal.setCarbs(mealDto.getCarbs() != null ? mealDto.getCarbs() : 0.0);
        meal.setFat(mealDto.getFat() != null ? mealDto.getFat() : 0.0);
        meal.setIron(mealDto.getIron() != null ? mealDto.getIron() : 0.0);
        meal.setCalcium(mealDto.getCalcium() != null ? mealDto.getCalcium() : 0.0);
        meal.setVitC(mealDto.getVitC() != null ? mealDto.getVitC() : 0.0);
        meal.setVitD(mealDto.getVitD() != null ? mealDto.getVitD() : 0.0);
        meal.setFiber(mealDto.getFiber() != null ? mealDto.getFiber() : 0.0);
        meal.setVitB12(mealDto.getVitB12() != null ? mealDto.getVitB12() : 0.0);
        
        if (mealDto.getConsumedOn() != null) {
            meal.setConsumedOn(LocalDate.parse(mealDto.getConsumedOn()));
        } else {
            meal.setConsumedOn(LocalDate.now());
        }
        
        return mealRepository.save(meal);
    }
    
    public void removeMeal(Long mealId, Long userId) {
        Optional<Meal> mealOpt = mealRepository.findById(mealId);
        
        if (mealOpt.isEmpty() || !mealOpt.get().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Meal not found or unauthorized");
        }
        
        mealRepository.deleteById(mealId);
    }
}
