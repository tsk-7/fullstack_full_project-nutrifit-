package com.nutrifit.service;

import com.nutrifit.entity.Conversation;
import com.nutrifit.entity.Message;
import com.nutrifit.entity.User;
import com.nutrifit.entity.Doctor;
import com.nutrifit.repository.ConversationRepository;
import com.nutrifit.repository.MessageRepository;
import com.nutrifit.repository.UserRepository;
import com.nutrifit.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MessageService {
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private DoctorService doctorService;
    
    private Conversation getOrCreateConversation(Long userId, Long doctorId) {
        Optional<Conversation> convOpt = conversationRepository.findByUserAndDoctor(userId, doctorId);
        
        if (convOpt.isPresent()) {
            return convOpt.get();
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        
        if (userOpt.isEmpty() || doctorOpt.isEmpty()) {
            throw new IllegalArgumentException("User or Doctor not found");
        }
        
        Conversation conversation = new Conversation();
        conversation.setUser(userOpt.get());
        conversation.setDoctor(doctorOpt.get());
        
        return conversationRepository.save(conversation);
    }
    
    public List<Message> getConversationMessages(Long userId, Long doctorId) {
        Conversation conversation = getOrCreateConversation(userId, doctorId);
        return messageRepository.findByConversationId(conversation.getId());
    }
    
    public Message sendMessage(Long userId, Long doctorId, String text, boolean isFromDoctor) {
        Conversation conversation = getOrCreateConversation(userId, doctorId);
        
        Message message = new Message();
        message.setConversation(conversation);
        message.setText(text);
        message.setRated(false);
        
        if (isFromDoctor) {
            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
            if (doctorOpt.isEmpty()) {
                throw new IllegalArgumentException("Doctor not found");
            }
            message.setSenderType(Message.SenderType.DOCTOR);
            message.setSenderDoctor(doctorOpt.get());
        } else {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("User not found");
            }
            message.setSenderType(Message.SenderType.USER);
            message.setSenderUser(userOpt.get());
        }
        
        return messageRepository.save(message);
    }
    
    public void rateMessage(Long messageId, Long userId, Integer rating, String feedback) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        
        if (messageOpt.isEmpty()) {
            throw new IllegalArgumentException("Message not found");
        }
        
        Message message = messageOpt.get();
        Conversation conversation = message.getConversation();
        
        if (!conversation.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to rate this message");
        }
        
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        message.setRated(true);
        message.setRating(rating);
        message.setFeedback(feedback);
        
        messageRepository.save(message);
        
        // Update doctor rating
        if (message.getSenderDoctor() != null) {
            doctorService.updateDoctorRating(message.getSenderDoctor().getId(), rating);
        }
    }
    
    public List<Conversation> getDoctorConversations(Long doctorId) {
        return conversationRepository.findByDoctorId(doctorId);
    }
}
