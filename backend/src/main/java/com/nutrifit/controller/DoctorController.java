package com.nutrifit.controller;

import com.nutrifit.dto.DoctorDto;
import com.nutrifit.entity.Doctor;
import com.nutrifit.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "http://localhost:5176")
public class DoctorController {
    
    @Autowired
    private DoctorService doctorService;
    
    @GetMapping
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        List<DoctorDto> doctorDtos = doctors.stream()
                .map(d -> new DoctorDto(d.getId(), d.getName(), d.getEmail(), d.getSpecialty(),
                                       d.getExperienceYears(), d.getRating(), d.getTotalRatings(),
                                       d.getAvatar(), d.getAvailable()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(doctorDtos);
    }
    
    @PatchMapping("/{doctorId}/availability")
    public ResponseEntity<Void> updateAvailability(@PathVariable Long doctorId,
                                                   @RequestParam Boolean available) {
        try {
            doctorService.updateAvailability(doctorId, available);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
