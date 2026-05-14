package com.infosys.backend.controller;

import com.infosys.backend.model.Order;
import com.infosys.backend.model.User;
import com.infosys.backend.repository.OrderRepository;
import com.infosys.backend.repository.UserRepository;
import com.infosys.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // CHECKOUT API
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @RequestBody java.util.Map<String, String> request,
            Principal principal) {

        try {
            String address = request.getOrDefault("shippingAddress", "");
            String paymentMethod = request.getOrDefault("paymentMethod", "Credit Card");

            Order order = cartService.checkout(principal.getName(), address, paymentMethod);

            return ResponseEntity.ok(order);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // GET MY ORDERS
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(Principal principal) {
        try {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            java.util.List<Order> orders = orderRepository.findByUserOrderByOrderDateDesc(user);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET ALL ORDERS (For Admin)
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        try {
            // Note: In a real app, verify admin role here
            java.util.List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id, Principal principal) {
        try {
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            
            // Basic auth check: if user is not admin and doesn't own the order, deny
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!user.getRole().equals("ADMIN") && !order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Unauthorized to view this order");
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}