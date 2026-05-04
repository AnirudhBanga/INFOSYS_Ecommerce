// ✅ T034: Setup CartItem repository

package com.infosys.backend.repository;

import com.infosys.backend.model.Cart;
import com.infosys.backend.model.CartItem;
import com.infosys.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * Get all items in a specific cart
     */
    List<CartItem> findByCart(Cart cart);

    /**
     * Find a specific item in a cart by product
     * Used to check if product is already in cart (to update quantity instead of adding duplicate)
     */
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    /**
     * Find item by cart and product ID
     */
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    /**
     * Count items in a cart
     */
    int countByCart(Cart cart);

    /**
     * Remove all items from a cart (clear cart)
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.cart = :cart")
    void deleteAllByCart(@Param("cart") Cart cart);

    /**
     * Remove a specific product from a cart
     */
    @Modifying
    @Transactional
    void deleteByCartAndProduct(Cart cart, Product product);
}
