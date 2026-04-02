package com.nutrifit.dto;

public class DoctorDto {
    private Long id;
    private String name;
    private String email;
    private String specialty;
    private Integer experienceYears;
    private Double rating;
    private Integer totalRatings;
    private String avatar;
    private Boolean available;

    public DoctorDto() {}
    
    public DoctorDto(Long id, String name, String email, String specialty, 
                     Integer experienceYears, Double rating, Integer totalRatings,
                     String avatar, Boolean available) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.specialty = specialty;
        this.experienceYears = experienceYears;
        this.rating = rating;
        this.totalRatings = totalRatings;
        this.avatar = avatar;
        this.available = available;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Integer totalRatings) { this.totalRatings = totalRatings; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
}
