package com.skyway.repository;

import com.skyway.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    boolean existsByBookingReference(String bookingReference);
    @EntityGraph(attributePaths = {"flight", "user", "passengers", "flight.departureAirport", "flight.arrivalAirport"})
    Page<Booking> findBookingsByUserId(Long userId, Pageable pageable);
    Booking findBookingByBookingReference(String bookingReference);
    @EntityGraph(attributePaths = {"flight", "user", "passengers", "flight.departureAirport", "flight.arrivalAirport", "flight.airplane"})
    Page<Booking> findAll(Pageable pageable);
}
