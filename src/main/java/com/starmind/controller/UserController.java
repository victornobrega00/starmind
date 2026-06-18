package com.starmind.controller;

import com.starmind.model.User;
import com.starmind.service.StarmindService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final StarmindService service;

    public UserController(StarmindService service) {
        this.service = service;
    }

    @GetMapping
    public User getUser(){
        return service.getUser();
    }
    @PutMapping("/time-limit")
    public User updateLimit(@RequestParam int minutes){
        return service.updateTimeLimit(minutes);
    }
}
