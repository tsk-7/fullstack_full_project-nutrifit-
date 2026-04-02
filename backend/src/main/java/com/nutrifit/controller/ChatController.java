package com.nutrifit.controller;

import com.nutrifit.dto.MessageDto;
import com.nutrifit.entity.Message;
import com.nutrifit.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "http://localhost:5176")
public class ChatController {
    
    @Autowired
    private MessageService messageService;
    
    @GetMapping("/conversation/{doctorId}")
    public ResponseEntity<List<MessageDto>> getConversation(@RequestParam Long userId,
                                                           @PathVariable Long doctorId) {
        try {
            List<Message> messages = messageService.getConversationMessages(userId, doctorId);
            List<MessageDto> messageDtos = messages.stream()
                    .map(this::convertToMessageDto)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(messageDtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(@RequestParam Long userId,
                                                 @RequestParam Long doctorId,
                                                 @RequestBody Map<String, String> payload) {
        try {
            String text = payload.get("text");
            Boolean isFromDoctor = Boolean.parseBoolean(payload.getOrDefault("isFromDoctor", "false"));
            
            Message message = messageService.sendMessage(userId, doctorId, text, isFromDoctor);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToMessageDto(message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{messageId}/rate")
    public ResponseEntity<Void> rateMessage(@PathVariable Long messageId,
                                           @RequestParam Long userId,
                                           @RequestParam Integer rating,
                                           @RequestParam(required = false) String feedback) {
        try {
            messageService.rateMessage(messageId, userId, rating, feedback);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    private MessageDto convertToMessageDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setSenderType(message.getSenderType().toString());
        dto.setText(message.getText());
        dto.setRated(message.getRated());
        dto.setRating(message.getRating());
        dto.setFeedback(message.getFeedback());
        dto.setCreatedAt(message.getCreatedAt().toString());
        return dto;
    }
}
