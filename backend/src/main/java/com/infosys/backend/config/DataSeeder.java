package com.infosys.backend.config;

import com.infosys.backend.model.Product;
import com.infosys.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase(ProductRepository productRepository) {
        return args -> {
            List<Product> existingSandals = productRepository.findByNameContainingIgnoreCase("Sandal");
            if (existingSandals.isEmpty()) {
                // If no sandals exist, let's insert some default ones
                Product s1 = new Product();
                s1.setName("Classic Leather Sandal");
                s1.setDescription("A premium leather sandal for casual outings.");
                s1.setPrice(1599.0);
                s1.setStock(20);
                s1.setCategory("Sandals");
                s1.setImageUrl("https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop&q=60");

                Product s2 = new Product();
                s2.setName("Sporty Trekking Sandal");
                s2.setDescription("Durable, waterproof, and built for outdoor adventures.");
                s2.setPrice(2299.0);
                s2.setStock(15);
                s2.setCategory("Sandals");
                s2.setImageUrl("https://images.unsplash.com/photo-1596766782352-7d1c6ee38db9?w=600&auto=format&fit=crop&q=60");

                Product s3 = new Product();
                s3.setName("Comfort Flip-Flops");
                s3.setDescription("Everyday lightweight comfort for home or beach.");
                s3.setPrice(499.0);
                s3.setStock(100);
                s3.setCategory("Sandals");
                s3.setImageUrl("https://images.unsplash.com/photo-1603145733190-59811e523c72?w=600&auto=format&fit=crop&q=60");

                Product s4 = new Product();
                s4.setName("Minimalist Strap Sandal");
                s4.setDescription("Elegant, simple strapped sandals that go with everything.");
                s4.setPrice(1299.0);
                s4.setStock(30);
                s4.setCategory("Sandals");
                s4.setImageUrl("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=60");

                Product s5 = new Product();
                s5.setName("Roman Gladiator Sandals");
                s5.setDescription("Trendy gladiator style sandals with durable sole.");
                s5.setPrice(1899.0);
                s5.setStock(10);
                s5.setCategory("Sandals");
                s5.setImageUrl("https://images.unsplash.com/photo-1515347619362-75fe22144d03?w=600&auto=format&fit=crop&q=60");

                productRepository.saveAll(List.of(s1, s2, s3, s4, s5));
                System.out.println("✅ Seeded 5 Sandals into the database.");
            }
        };
    }
}
