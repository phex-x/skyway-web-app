package com.skyway.repository;

import com.skyway.entity.Airport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {
    boolean existsByIcaoCode(String icao);
    Page<Airport> findAll(Pageable pageable);
}
