package com.skyway.repository;

import com.skyway.entity.Airplane;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirplaneRepository extends JpaRepository<Airplane, Long> {
    Boolean existsByRegistrationNumber(String registrationNumber);
    Page<Airplane> findAll(Pageable pageable);
}
