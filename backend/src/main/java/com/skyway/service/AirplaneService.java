package com.skyway.service;

import com.skyway.dto.AirplaneCreate;
import com.skyway.dto.AirplaneResponse;
import com.skyway.entity.Airplane;
import com.skyway.error.AirplaneAlreadyExistsException;
import com.skyway.error.AirplaneNotFoundException;
import com.skyway.mapper.AirplaneMapper;
import com.skyway.repository.AirplaneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public AirplaneResponse getAirplaneById(Long id){
        return airplaneMapper.toDto(airplaneRepository.findById(id)
                .orElseThrow(() -> new AirplaneNotFoundException("airplane with id: " + id + " doesn't exists")));
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

    public List<AirplaneResponse> getAllAirplanes(){
        List<Airplane> airplanes = airplaneRepository.findAll();
        return airplanes.stream()
                .map(flight -> airplaneMapper.toDto(flight))
                .collect(Collectors.toList());
    }
}
