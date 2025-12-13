package com.skyway.repository;

import com.skyway.entity.Flight;
import com.skyway.entity.SeatClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    @Query("SELECT f FROM Flight f " +
            "JOIN f.departureAirport da " +
            "JOIN f.arrivalAirport aa " +
            "WHERE da.city = :departureCity " +
            "AND aa.city = :arrivalCity " +
            "AND DATE(f.scheduledDeparture) = :departureDate " +
            "AND ( " +
            "   (:seatClass = 'ECONOMY' AND f.remainingEconomySeats >= :passengers) OR " +
            "   (:seatClass = 'BUSINESS' AND f.remainingBusinessSeats >= :passengers) " +
            ")")
    List<Flight> flightSearch(
            @Param("departureCity") String departureCity,
            @Param("arrivalCity") String arrivalCity,
            @Param("departureDate") LocalDate departureDate,
            @Param("passengers") int passengers,
            @Param("seatClass") String seatClass
    );

    public boolean existsByFlightNumber(String flightNumber);
}
