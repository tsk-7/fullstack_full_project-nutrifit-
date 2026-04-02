package com.nutrifit.dto;

public class MessageDto {
    private Long id;
    private String senderType;
    private String text;
    private Boolean rated;
    private Integer rating;
    private String feedback;
    private String createdAt;

    public MessageDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Boolean getRated() { return rated; }
    public void setRated(Boolean rated) { this.rated = rated; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
