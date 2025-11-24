package com.skyway.repository;

import com.skyway.entity.Passenger;
import com.skyway.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger,Long> {
    Optional<Passenger> findByUser(User user);
    Optional<Passenger> findById(Long id);
}
