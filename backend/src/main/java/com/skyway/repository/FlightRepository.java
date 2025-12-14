package com.skyway.repository;

import com.skyway.entity.Flight;
import com.skyway.entity.SeatClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    @Query("""
        SELECT f FROM Flight f
        WHERE LOWER(f.departureAirport.city) LIKE LOWER(CONCAT('%', :departureAirport, '%'))
        AND LOWER(f.arrivalAirport.city) LIKE LOWER(CONCAT('%', :arrivalAirport, '%'))
        AND DATE(f.scheduledDeparture) = :departureDate
        AND (:passengerCount <=
             CASE :seatClass
                WHEN 'ECONOMY' THEN f.remainingEconomySeats
                WHEN 'BUSINESS' THEN f.remainingBusinessSeats
                ELSE 0
             END)
        """)
    Page<Flight> flightSearch(
            @Param("departureAirport") String departureAirport,
            @Param("arrivalAirport") String arrivalAirport,
            @Param("departureDate") LocalDate departureDate,
            @Param("passengerCount") int passengerCount,
            @Param("seatClass") String seatClass,
            Pageable pageable
    );

    boolean existsByFlightNumber(String flightNumber);
    Page<Flight> findAll(Pageable pageable);
}
