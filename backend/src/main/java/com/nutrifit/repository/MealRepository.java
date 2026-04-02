package com.nutrifit.repository;

import com.nutrifit.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    
    @Query("SELECT m FROM Meal m WHERE m.user.id = :userId AND m.consumedOn = :date ORDER BY m.createdAt DESC")
    List<Meal> findByUserAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);
    
    @Query("SELECT m FROM Meal m WHERE m.user.id = :userId AND m.consumedOn >= :startDate AND m.consumedOn <= :endDate ORDER BY m.consumedOn DESC")
    List<Meal> findByUserAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
