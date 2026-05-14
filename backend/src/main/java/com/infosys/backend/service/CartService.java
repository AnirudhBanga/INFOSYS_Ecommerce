package com.infosys.backend.service;

import com.infosys.backend.model.*;
import com.infosys.backend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ─────────────────────────────────────────────────────────
    // GET CART
    // ─────────────────────────────────────────────────────────
    public Cart getCartByUserEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return cartRepository.findByUserIdWithItems(user.getId())
                .orElseGet(() -> {

                    Cart newCart = new Cart(user);

                    return cartRepository.save(newCart);
                });
    }

    // ─────────────────────────────────────────────────────────
    // ADD TO CART
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Cart addToCart(
            String email,
            Long productId,
            int quantity,
            String selectedSize
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() ->
                        cartRepository.save(new Cart(user)));

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        Optional<CartItem> existingItem =
                cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItem.isPresent()) {

            CartItem item = existingItem.get();

            item.setQuantity(
                    item.getQuantity() + quantity
            );

            cartItemRepository.save(item);

        } else {

            CartItem newItem =
                    new CartItem(
                            cart,
                            product,
                            quantity,
                            selectedSize
                    );

            cartItemRepository.save(newItem);
        }

        return cartRepository
                .findByUserIdWithItems(user.getId())
                .orElse(cart);
    }

    // ─────────────────────────────────────────────────────────
    // REMOVE FROM CART
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Cart removeFromCart(
            String email,
            Long cartItemId
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        cartItemRepository.delete(item);

        return cartRepository
                .findByUserIdWithItems(user.getId())
                .orElse(cart);
    }

    // ─────────────────────────────────────────────────────────
    // UPDATE QUANTITY
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Cart updateQuantity(
            String email,
            Long cartItemId,
            int newQuantity
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (newQuantity <= 0) {

            cartItemRepository.delete(item);

        } else {

            item.setQuantity(newQuantity);

            cartItemRepository.save(item);
        }

        return cartRepository
                .findByUserIdWithItems(user.getId())
                .orElse(cart);
    }

    // ─────────────────────────────────────────────────────────
    // CLEAR CART
    // ─────────────────────────────────────────────────────────
    @Transactional
    public void clearCart(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        cartItemRepository.deleteAllByCart(cart);
    }

    // ─────────────────────────────────────────────────────────
    // CHECKOUT + SAVE ORDER
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Order checkout(String email, String shippingAddress, String paymentMethod) {

        // FIND USER
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // GET CART
        Cart cart = cartRepository
                .findByUserIdWithItems(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // CREATE ORDER
        Order order = new Order();

        order.setUser(user);

        double total = 0;

        // CONVERT CART ITEMS → ORDER ITEMS
        for (CartItem cartItem : cart.getCartItems()) {

            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(cartItem.getProduct());

            orderItem.setQuantity(cartItem.getQuantity());

            orderItem.setPrice(
                    cartItem.getProduct().getPrice()
            );

            orderItem.setSelectedSize(
                    cartItem.getSelectedSize()
            );

            order.addOrderItem(orderItem);

            total +=
                    cartItem.getProduct().getPrice()
                    * cartItem.getQuantity();
        }

        // SET TOTAL AND CHECKOUT DETAILS
        order.setTotalPrice(total);
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);

        // SAVE ORDER
        Order savedOrder =
                orderRepository.save(order);

        // CLEAR CART
        cartItemRepository.deleteAllByCart(cart);

        return savedOrder;
    }
}