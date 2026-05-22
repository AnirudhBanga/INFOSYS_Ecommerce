package com.infosys.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.infosys.backend.model.User;
import com.infosys.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(User user) {

        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // 🔥 password encrypt
        user.setPassword(encoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User login(String email, String password){

User user = userRepository
.findByEmail(email)
.orElseThrow(() ->
new RuntimeException("User not found"));

if(!encoder.matches(password,user.getPassword())){
    if(password.equals(user.getPassword())) {
        // Upgrade plaintext password to encrypted
        user.setPassword(encoder.encode(password));
        userRepository.save(user);
    } else {
        throw new RuntimeException("Invalid Password");
    }
}

return user;
}

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String email, User updatedData) {
        User user = getUserByEmail(email);
        user.setName(updatedData.getName());
        user.setPhoneNo(updatedData.getPhoneNo());
        user.setAge(updatedData.getAge());
        user.setGender(updatedData.getGender());
        user.setAddress(updatedData.getAddress());
        user.setDob(updatedData.getDob());
        user.setPreferences(updatedData.getPreferences());
        return userRepository.save(user);
    }

    public void updatePassword(String email, String oldPassword, String newPassword) {
        User user = getUserByEmail(email);
        
        // Verify old password
        if (!encoder.matches(oldPassword, user.getPassword())) {
            // Also check plaintext for backward compatibility
            if (!oldPassword.equals(user.getPassword())) {
                throw new RuntimeException("Incorrect old password");
            }
        }
        
        // Update to new hashed password
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }

    public void resetPassword(String email, String newPassword) {
        User user = getUserByEmail(email);
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }

}