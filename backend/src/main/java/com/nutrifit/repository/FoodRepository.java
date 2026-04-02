package com.nutrifit.repository;

import com.nutrifit.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    @Query("SELECT f FROM Food f ORDER BY f.name ASC")
    List<Food> findAllSorted();
}
