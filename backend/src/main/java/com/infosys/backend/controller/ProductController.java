package com.infosys.backend.controller;

import com.infosys.backend.model.Product;
import com.infosys.backend.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;
    private static final String UPLOAD_DIR = "uploads/";

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ── GET all products ──────────────────────────────────────────────────────
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ── GET single product by ID ──────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── GET search by keyword ─────────────────────────────────────────────────
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    // ── POST add product (FIXED: URL is /api/products, auth via JWT not header) ─
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            Product saved = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving product: " + e.getMessage());
        }
    }

    // ── POST /api/products/add (kept for backward compat) ────────────────────
    @PostMapping("/add")
    public ResponseEntity<?> addProductAlt(@RequestBody Product product) {
        return addProduct(product);
    }

    // ── PUT update product ────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updated) {

        return productRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setPrice(updated.getPrice());
            existing.setStock(updated.getStock());
            existing.setCategory(updated.getCategory());
            if (updated.getImageUrl() != null && !updated.getImageUrl().isEmpty()) {
                existing.setImageUrl(updated.getImageUrl());
            }
            return ResponseEntity.ok(productRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE product ────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @Autowired
    private com.infosys.backend.service.CloudinaryService cloudinaryService;

    // ── POST upload image file for a product ─────────────────────────────────
    // Image saved to Cloudinary, URL stored in product.imageUrl
    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        Optional<Product> opt = productRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        try {
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);

            // Store secure URL in product
            Product product = opt.get();
            product.setImageUrl(imageUrl);
            productRepository.save(product);

            return ResponseEntity.ok("{\"imageUrl\":\"" + imageUrl + "\"}");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + e.getMessage());
        }
    }

    // ── GET serve image file ──────────────────────────────────────────────────
    // <img src="http://localhost:8081/api/products/image/product_3_xxx.jpg" />
    @GetMapping("/image/{filename}")
    public ResponseEntity<byte[]> serveImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            if (!Files.exists(filePath)) return ResponseEntity.notFound().build();

            byte[]    data      = Files.readAllBytes(filePath);
            MediaType mediaType = detectMediaType(filename);
            return ResponseEntity.ok().contentType(mediaType).body(data);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf("."));
    }

    private MediaType detectMediaType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".png"))  return MediaType.IMAGE_PNG;
        if (lower.endsWith(".gif"))  return MediaType.IMAGE_GIF;
        if (lower.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        return MediaType.IMAGE_JPEG;
    }
}