package com.nutrifit.repository;

import com.nutrifit.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.createdAt ASC")
    List<Message> findByConversationId(@Param("conversationId") Long conversationId);
    
    @Query("SELECT m FROM Message m WHERE m.senderDoctor.id = :doctorId AND m.rated = true ORDER BY m.createdAt DESC")
    List<Message> findRatedMessagesByDoctor(@Param("doctorId") Long doctorId);
}
