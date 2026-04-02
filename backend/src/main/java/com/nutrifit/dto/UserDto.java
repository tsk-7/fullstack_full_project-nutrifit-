package com.nutrifit.dto;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private String dateOfBirth;
    private Boolean profileComplete;
    private String role;

    public UserDto() {}
    
    public UserDto(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Boolean getProfileComplete() { return profileComplete; }
    public void setProfileComplete(Boolean profileComplete) { this.profileComplete = profileComplete; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
