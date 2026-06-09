// ✅ T035: Add to Cart API  → POST /api/cart/add
// ✅ T036: Get Cart API     → GET  /api/cart

package com.infosys.backend.controller;

import com.infosys.backend.dto.CartResponseDTO;
import com.infosys.backend.model.Cart;
import com.infosys.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:5173}")
public class CartController {

    @Autowired
    private CartService cartService;

    // ─────────────────────────────────────────────────────────────────────────
    // T036: GET CART
    // GET /api/cart
    // Returns: CartResponseDTO (clean JSON, no infinite loop)
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getCart(Principal principal) {
        try {
            Cart cart = cartService.getCartByUserEmail(principal.getName());
            return ResponseEntity.ok(CartResponseDTO.from(cart));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching cart: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // T035: ADD TO CART
    // POST /api/cart/add
    // Body: { "productId": 1, "quantity": 1, "selectedSize": "9" }
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody Map<String, Object> body,
            Principal principal) {
        try {
            Long   productId    = Long.valueOf(body.get("productId").toString());
            int    quantity     = Integer.parseInt(body.getOrDefault("quantity", 1).toString());
            String selectedSize = body.getOrDefault("selectedSize", "").toString();

            Cart cart = cartService.addToCart(principal.getName(), productId, quantity, selectedSize);
            return ResponseEntity.ok(CartResponseDTO.from(cart));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REMOVE FROM CART
    // DELETE /api/cart/remove/{cartItemId}
    // ─────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long cartItemId,
            Principal principal) {
        try {
            Cart cart = cartService.removeFromCart(principal.getName(), cartItemId);
            return ResponseEntity.ok(CartResponseDTO.from(cart));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE QUANTITY
    // PUT /api/cart/update/{cartItemId}
    // Body: { "quantity": 3 }
    // ─────────────────────────────────────────────────────────────────────────
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> body,
            Principal principal) {
        try {
            Cart cart = cartService.updateQuantity(
                principal.getName(), cartItemId, body.get("quantity"));
            return ResponseEntity.ok(CartResponseDTO.from(cart));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CLEAR CART
    // DELETE /api/cart/clear
    // ─────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Principal principal) {
        try {
            cartService.clearCart(principal.getName());
            return ResponseEntity.ok("Cart cleared");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}