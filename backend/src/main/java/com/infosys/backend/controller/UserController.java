package com.infosys.backend.controller;

import com.infosys.backend.model.User;
import com.infosys.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:5173}")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedData, Principal principal) {
        try {
            User user = userService.updateProfile(principal.getName(), updatedData);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> passwords, Principal principal) {
        try {
            String oldPassword = passwords.get("oldPassword");
            String newPassword = passwords.get("newPassword");
            
            if (oldPassword == null || newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body("Invalid password data");
            }
            
            userService.updatePassword(principal.getName(), oldPassword, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request, Principal principal) {
        try {
            String newPassword = request.get("newPassword");
            
            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body("Invalid password data");
            }
            
            userService.resetPassword(principal.getName(), newPassword);
            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
