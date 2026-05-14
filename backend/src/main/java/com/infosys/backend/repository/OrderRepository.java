package com.infosys.backend.repository;

import com.infosys.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    java.util.List<Order> findByUserOrderByOrderDateDesc(com.infosys.backend.model.User user);
    java.util.List<Order> findAllByOrderByOrderDateDesc();
}