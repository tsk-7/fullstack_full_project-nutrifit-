package com.nutrifit.repository;

import com.nutrifit.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    @Query("SELECT c FROM Conversation c WHERE c.user.id = :userId AND c.doctor.id = :doctorId")
    Optional<Conversation> findByUserAndDoctor(@Param("userId") Long userId, @Param("doctorId") Long doctorId);
    
    @Query("SELECT c FROM Conversation c WHERE c.doctor.id = :doctorId ORDER BY c.createdAt DESC")
    List<Conversation> findByDoctorId(@Param("doctorId") Long doctorId);
}
