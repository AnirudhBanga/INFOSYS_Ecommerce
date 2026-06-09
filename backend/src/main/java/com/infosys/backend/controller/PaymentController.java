package com.infosys.backend.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:5173}")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${app.demo.mode:false}")
    private boolean isDemoMode;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = Integer.parseInt(data.get("amount").toString());
            
            // DEMO MODE BYPASS - Allowed only when explicit app.demo.mode=true is set
            if (isDemoMode && "rzp_test_your_key_id_here".equals(keyId)) {
                JSONObject fakeOrder = new JSONObject();
                fakeOrder.put("id", "order_demo_" + System.currentTimeMillis());
                fakeOrder.put("amount", amount * 100);
                fakeOrder.put("currency", "INR");
                fakeOrder.put("status", "created");
                return ResponseEntity.ok(fakeOrder.toString());
            }

            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // amount in the smallest currency unit (paise)
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
            
            Order order = client.orders.create(orderRequest);
            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating Razorpay order: " + e.getMessage());
        }
    }

    @GetMapping("/key")
    public ResponseEntity<?> getRazorpayKey() {
        return ResponseEntity.ok(Map.of("keyId", keyId));
    }
}
