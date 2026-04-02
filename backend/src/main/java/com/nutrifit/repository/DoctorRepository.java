package com.nutrifit.repository;

import com.nutrifit.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT d FROM Doctor d ORDER BY d.rating DESC, d.totalRatings DESC")
    List<Doctor> findAllSortedByRating();
}
