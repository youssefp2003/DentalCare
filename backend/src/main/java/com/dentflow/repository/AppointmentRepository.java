package com.dentflow.repository;

import com.dentflow.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
}