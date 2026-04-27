package com.infosys.backend.controller;

import com.infosys.backend.model.Product;
import com.infosys.backend.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins="http://localhost:5173")
public class ProductController {

private final ProductRepository productRepository;

public ProductController(
ProductRepository productRepository){
this.productRepository=productRepository;
}



@PostMapping("/add")
public Product addProduct(
@RequestBody Product product){

return productRepository.save(product);

}



@GetMapping
public List<Product> getAllProducts(){

return productRepository.findAll();

}

}