package com.infosys.backend.model;

import jakarta.persistence.*;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int stock;

    // ✅ ADDED: category field (was missing — caused DB mismatch)
    private String category;

    // ✅ ADDED: imageUrl field (was missing — images couldn't be stored)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // ── Constructors ──────────────────────────────────────────────────────────
    public Product() {}

    public Product(String name, String description, double price, int stock, String category) {
        this.name        = name;
        this.description = description;
        this.price       = price;
        this.stock       = stock;
        this.category    = category;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()          { return id; }
    public void setId(Long id)   { this.id = id; }

    public String getName()              { return name; }
    public void   setName(String name)   { this.name = name; }

    public String getDescription()                   { return description; }
    public void   setDescription(String description) { this.description = description; }

    public double getPrice()               { return price; }
    public void   setPrice(double price)   { this.price = price; }

    public int  getStock()             { return stock; }
    public void setStock(int stock)    { this.stock = stock; }

    public String getCategory()                  { return category; }
    public void   setCategory(String category)   { this.category = category; }

    public String getImageUrl()                  { return imageUrl; }
    public void   setImageUrl(String imageUrl)   { this.imageUrl = imageUrl; }
}