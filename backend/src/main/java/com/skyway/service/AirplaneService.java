package com.skyway.service;

import com.skyway.dto.AirplaneCreate;
import com.skyway.entity.Airplane;
import com.skyway.error.AirplaneAlreadyExistsException;
import com.skyway.error.AirplaneNotFoundException;
import com.skyway.mapper.AirplaneMapper;
import com.skyway.repository.AirplaneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirplaneService {
    @Autowired
    private AirplaneRepository airplaneRepository;

    @Autowired
    private AirplaneMapper airplaneMapper;

    public void createAirplane(AirplaneCreate airplaneCreate) throws AirplaneAlreadyExistsException {
        if (!airplaneRepository.existsByRegistrationNumber(airplaneCreate.getRegistrationNumber())) {
            airplaneRepository.save(airplaneMapper.toAirplane(airplaneCreate));
        } else throw new AirplaneAlreadyExistsException("airplane with registration number: " +
                airplaneCreate.getRegistrationNumber() + " already exists");
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

    public boolean existsByCode(String code) {
        return airplaneRepository.existsByRegistrationNumber(code);
    }

    public List<Airplane> getAllAirplanes(){
        return airplaneRepository.findAll();
    }
}
