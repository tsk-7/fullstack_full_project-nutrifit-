package com.nutrifit.service;

import com.nutrifit.entity.Doctor;
import com.nutrifit.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DoctorService {
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Doctor registerDoctor(String name, String email, String password, 
                                String specialty, Integer experienceYears) {
        if (doctorRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Doctor already exists with this email");
        }
        
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setEmail(email);
        doctor.setPasswordHash(passwordEncoder.encode(password));
        doctor.setSpecialty(specialty);
        doctor.setExperienceYears(experienceYears);
        doctor.setAvatar(generateAvatar(name));
        doctor.setAvailable(true);
        doctor.setRating(0.0);
        doctor.setTotalRatings(0);
        
        return doctorRepository.save(doctor);
    }
    
    public Doctor loginDoctor(String email, String password) {
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(email);
        
        if (doctorOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        Doctor doctor = doctorOpt.get();
        if (!passwordEncoder.matches(password, doctor.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        return doctor;
    }
    
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAllSortedByRating();
    }
    
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }
    
    public Doctor updateAvailability(Long id, Boolean available) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(id);
        
        if (doctorOpt.isEmpty()) {
            throw new IllegalArgumentException("Doctor not found");
        }
        
        Doctor doctor = doctorOpt.get();
        doctor.setAvailable(available);
        
        return doctorRepository.save(doctor);
    }
    
    public void updateDoctorRating(Long doctorId, Integer newRating) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        
        if (doctorOpt.isEmpty()) {
            return;
        }
        
        Doctor doctor = doctorOpt.get();
        int oldTotal = doctor.getTotalRatings();
        double oldRating = doctor.getRating();
        
        int newTotal = oldTotal + 1;
        double newAvgRating = ((oldRating * oldTotal) + newRating) / newTotal;
        
        doctor.setRating(Math.round(newAvgRating * 100.0) / 100.0);
        doctor.setTotalRatings(newTotal);
        
        doctorRepository.save(doctor);
    }
    
    private String generateAvatar(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "DR";
        }
        String[] parts = name.split(" ");
        StringBuilder avatar = new StringBuilder();
        for (String part : parts) {
            if (avatar.length() < 2 && !part.isEmpty()) {
                avatar.append(part.charAt(0));
            }
        }
        String result = avatar.toString().toUpperCase();
        return result.isEmpty() ? "DR" : result;
    }
}
