package com.infosys.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProtectedController {

    @GetMapping("/dashboard")
    public String dashboard(){

        return "Protected API Access Granted";
    }
}