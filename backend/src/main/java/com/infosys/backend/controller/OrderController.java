package com.infosys.backend.controller;

import com.infosys.backend.model.Order;
import com.infosys.backend.model.User;
import com.infosys.backend.repository.OrderRepository;
import com.infosys.backend.repository.UserRepository;
import com.infosys.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import com.razorpay.Utils;
import org.json.JSONObject;

import java.security.Principal;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:5173}")
public class OrderController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${app.demo.mode:false}")
    private boolean isDemoMode;

    // CHECKOUT API
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @RequestBody java.util.Map<String, String> request,
            Principal principal) {

        try {
            String address = request.getOrDefault("shippingAddress", "");
            String paymentMethod = request.getOrDefault("paymentMethod", "Credit Card");
            String razorpayOrderId = request.getOrDefault("razorpayOrderId", null);
            String razorpayPaymentId = request.getOrDefault("razorpayPaymentId", null);
            String razorpaySignature = request.getOrDefault("razorpaySignature", null);
            
            String paymentStatus = "PENDING";

            // Verify signature if payment is online
            if (!"Cash on Delivery".equals(paymentMethod) && razorpayOrderId != null && razorpayPaymentId != null) {
                if (isDemoMode) {
                    // DEMO MODE BYPASS - Allowed only when explicit app.demo.mode=true is set
                    paymentStatus = "SUCCESS";
                } else {
                    JSONObject options = new JSONObject();
                    options.put("razorpay_order_id", razorpayOrderId);
                    options.put("razorpay_payment_id", razorpayPaymentId);
                    options.put("razorpay_signature", razorpaySignature);
                    
                    boolean status = Utils.verifyPaymentSignature(options, keySecret);
                    if (status) {
                        paymentStatus = "SUCCESS";
                    } else {
                        return ResponseEntity.badRequest().body("Payment signature verification failed");
                    }
                }
            } else if ("Cash on Delivery".equals(paymentMethod)) {
                paymentStatus = "SUCCESS"; // COD is treated as success for order placement
            }

            Order order = cartService.checkout(principal.getName(), address, paymentMethod, razorpayOrderId, razorpayPaymentId, paymentStatus);

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