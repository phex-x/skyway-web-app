package com.skyway.controller;

import com.skyway.dto.UserChangeRole;
import com.skyway.dto.UserResponseDTO;
import com.skyway.service.AdminService;
import com.skyway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    UserService userService;

    @Autowired
    private AdminService adminService;

    @GetMapping("/user/get-all")
    public ResponseEntity<Page<UserResponseDTO>> getAll(
            @PageableDefault(size = 10,
                    sort = "id",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ){
        return ResponseEntity.ok().body(userService.getAllUsers(pageable));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id){
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @DeleteMapping("user/delete/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id){
        userService.deleteUserById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/disable/{id}")
    public ResponseEntity<?> disableUserById(@PathVariable Long id){
        userService.disableUserById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/enable/{id}")
    public ResponseEntity<?> enableUserById(@PathVariable Long id){
        userService.enableUserById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/change-role")
    public ResponseEntity<?> changeRoleById(@RequestBody UserChangeRole userChangeRole){
        userService.changeRole(userChangeRole.getId(), userChangeRole.getNewRole());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> statistics(){
        return ResponseEntity.ok().body(adminService.getStatistics());
    }

}
