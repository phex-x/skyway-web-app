package com.skyway.repository;

import com.skyway.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    public boolean existsByBookingReference(String bookingReference);
    public List<Booking> findBookingsByUserId(Long userId);
}
