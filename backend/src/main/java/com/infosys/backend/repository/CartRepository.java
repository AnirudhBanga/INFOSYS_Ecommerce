// ✅ T034: Setup Cart repository

package com.infosys.backend.repository;

import com.infosys.backend.model.Cart;
import com.infosys.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    /**
     * Find cart by User object
     * Used to get the cart of the currently logged-in user
     */
    Optional<Cart> findByUser(User user);

    /**
     * Find cart by user's ID directly
     * More efficient — avoids loading the full User object
     */
    Optional<Cart> findByUserId(Long userId);

    /**
     * Check if a cart exists for a given user
     * Useful before creating a new cart
     */
    boolean existsByUser(User user);

    /**
     * Custom JPQL: Fetch cart with all items and products in one query
     * Prevents N+1 problem when loading cart items
     */
    @Query("SELECT c FROM Cart c " +
           "LEFT JOIN FETCH c.cartItems ci " +
           "LEFT JOIN FETCH ci.product " +
           "WHERE c.user.id = :userId")
    Optional<Cart> findByUserIdWithItems(@Param("userId") Long userId);

    /**
     * Delete cart by user
     * Called when user logs out or cart is cleared
     */
    void deleteByUser(User user);
}
