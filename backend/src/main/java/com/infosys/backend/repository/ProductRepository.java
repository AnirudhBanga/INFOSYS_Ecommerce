package com.infosys.backend.repository;

import java.util.List;

import com.infosys.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository
extends JpaRepository<Product,Long>{

List<Product>
findByNameContainingIgnoreCase(
String keyword
);

}