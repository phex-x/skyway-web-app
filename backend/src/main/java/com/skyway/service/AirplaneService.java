package com.skyway.service;

import com.skyway.entity.Airplane;
import com.skyway.error.AirplaneAlreadyExistsException;
import com.skyway.error.AirplaneNotFoundException;
import com.skyway.repository.AirplaneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AirplaneService {
    @Autowired
    private AirplaneRepository airplaneRepository;

    public void createAirplane(Airplane airplane){
        if (!airplaneRepository.existsByRegistrationNumber(airplane.getRegistrationNumber())) {
            airplaneRepository.save(airplane);
        } else throw new AirplaneAlreadyExistsException("airplane with registration number: " +
                airplane.getRegistrationNumber() + " already exists");
    }

    public Airplane getAirplaneById(Long id){
        Airplane airplane = airplaneRepository.findById(id)
                .orElseThrow(() -> new AirplaneNotFoundException("airplane with id: " + id + " doecn't exists"));
        return airplane;
    }

    public void deleteAirplane(Long id){
        if (!airplaneRepository.existsById(id)) {
            throw new AirplaneNotFoundException("airplane with id: " + id + " doecn't exists");
        }
        airplaneRepository.deleteById(id);
    }
}
