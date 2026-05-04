// ✅ T033: Create CartItem entity (Cart → CartItem relationship)

package com.infosys.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many cart items belong to one cart
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Many cart items can reference the same product
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    // Optional: store selected size (e.g. UK 9)
    @Column(name = "selected_size")
    private String selectedSize;

    // ── Constructors ──────────────────────────────────────
    public CartItem() {}

    public CartItem(Cart cart, Product product, int quantity) {
        this.cart     = cart;
        this.product  = product;
        this.quantity = quantity;
    }

    public CartItem(Cart cart, Product product, int quantity, String selectedSize) {
        this.cart         = cart;
        this.product      = product;
        this.quantity     = quantity;
        this.selectedSize = selectedSize;
    }

    // ── Helper ────────────────────────────────────────────
    /** Price of this line item */
    public double getSubtotal() {
        return product.getPrice() * quantity;
    }

    // ── Getters & Setters ─────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getSelectedSize() { return selectedSize; }
    public void setSelectedSize(String selectedSize) { this.selectedSize = selectedSize; }
}
