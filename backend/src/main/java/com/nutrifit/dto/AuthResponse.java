package com.nutrifit.dto;

public class AuthResponse {
    private String token;
    private UserDto user;
    private DoctorDto doctor;

    public AuthResponse() {}
    
    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }
    
    public AuthResponse(String token, DoctorDto doctor) {
        this.token = token;
        this.doctor = doctor;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public DoctorDto getDoctor() { return doctor; }
    public void setDoctor(DoctorDto doctor) { this.doctor = doctor; }
}
