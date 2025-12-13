package com.skyway.repository;

import com.skyway.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {
    public boolean existsByIcaoCode(String icao);
    public Airport findByIcaoCode(String icao);
}
