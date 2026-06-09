package com.infosys.backend.controller;

import java.util.HashMap;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.backend.model.User;
import com.infosys.backend.security.JwtUtil;
import com.infosys.backend.service.UserService;

@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:5173}")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

@Autowired
private JwtUtil jwtUtil;

@Autowired
private UserService userService;



@PostMapping("/register")
public ResponseEntity<?> register(
@Valid @RequestBody User user){

user.setRole("USER");

User savedUser=
userService.register(user);

savedUser.setPassword(null);

return ResponseEntity.ok(
savedUser
);

}



@PostMapping("/login")
public ResponseEntity<?> login(
@RequestBody User user){

User existingUser=
userService.login(
user.getEmail(),
user.getPassword()
);


String token=
jwtUtil.generateToken(
existingUser.getEmail()
);

 
Map<String,String> response=
new HashMap<>();

response.put(
"token",
token
);

response.put(
"role",
existingUser.getRole()
);

return ResponseEntity.ok(
response
);

}


@GetMapping("/dashboard")
public String dashboard(){

return "Protected API Accessed!";

}

}