// DTO = Data Transfer Object
// Cart entity mein User hai, User mein Cart hai → JSON infinite loop hota hai
// Is DTO se sirf woh data bhejenge jo frontend ko chahiye

package com.infosys.backend.dto;

import com.infosys.backend.model.Cart;
import com.infosys.backend.model.CartItem;
import com.infosys.backend.model.Product;

import java.util.List;
import java.util.stream.Collectors;

public class CartResponseDTO {

    private Long   cartId;
    private Long   userId;
    private String userEmail;
    private List<CartItemDTO> cartItems;
    private double totalPrice;
    private int    totalItems;

    // ── Inner DTO for CartItem ────────────────────────────────────────────────
    public static class CartItemDTO {
        private Long   id;
        private Product product;
        private int    quantity;
        private String selectedSize;
        private double subtotal;

        // Convert CartItem entity → CartItemDTO
        public static CartItemDTO from(CartItem item) {
            CartItemDTO dto    = new CartItemDTO();
            dto.id             = item.getId();
            dto.product        = item.getProduct();
            dto.quantity       = item.getQuantity();
            dto.selectedSize   = item.getSelectedSize();
            dto.subtotal       = item.getSubtotal();
            return dto;
        }

        // Getters
        public Long    getId()           { return id; }
        public Product getProduct()      { return product; }
        public int     getQuantity()     { return quantity; }
        public String  getSelectedSize() { return selectedSize; }
        public double  getSubtotal()     { return subtotal; }
    }

    // Convert Cart entity → CartResponseDTO
    public static CartResponseDTO from(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.cartId    = cart.getId();
        dto.userId    = cart.getUser().getId();
        dto.userEmail = cart.getUser().getEmail();
        dto.cartItems = cart.getCartItems().stream()
                            .map(CartItemDTO::from)
                            .collect(Collectors.toList());
        dto.totalPrice = cart.getTotalPrice();
        dto.totalItems = cart.getTotalItems();
        return dto;
    }

    // Getters
    public Long   getCartId()    { return cartId; }
    public Long   getUserId()    { return userId; }
    public String getUserEmail() { return userEmail; }
    public List<CartItemDTO> getCartItems() { return cartItems; }
    public double getTotalPrice(){ return totalPrice; }
    public int    getTotalItems(){ return totalItems; }
}