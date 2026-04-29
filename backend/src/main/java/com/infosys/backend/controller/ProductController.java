package com.infosys.backend.controller;

import com.infosys.backend.model.Product;
import com.infosys.backend.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins="http://localhost:5173")

public class ProductController{

private final ProductRepository productRepository;

public ProductController(
ProductRepository productRepository){
this.productRepository=
productRepository;
}



@PostMapping("/add")
public ResponseEntity<?> addProduct(
@RequestBody Product product,
@RequestHeader("Role") String role
){

if(!role.equals("ADMIN")){

return ResponseEntity
.status(403)
.body("Access Denied");

}

return ResponseEntity.ok(
productRepository.save(product)
);

}



@GetMapping
public List<Product> getAllProducts(){

return productRepository.findAll();

}



@GetMapping("/{id}")
public Product getProductById(
@PathVariable Long id){

return productRepository
.findById(id)
.orElseThrow();

}



@GetMapping("/search")
public List<Product> searchProducts(
@RequestParam String keyword){

return productRepository
.findByNameContainingIgnoreCase(
keyword
);

}

}