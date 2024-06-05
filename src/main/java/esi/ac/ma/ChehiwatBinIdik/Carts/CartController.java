package esi.ac.ma.ChehiwatBinIdik.Carts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping
    public ResponseEntity<Void> addToCart(@RequestBody Cart cart) {
        try {
            cartService.addToCart(cart);
            return ResponseEntity.status(201).build();
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getCartItemsByUserId(@PathVariable String userId) {
        try {
            List<Cart> cartItems = cartService.getCartItemsByUserId(userId);
            return ResponseEntity.ok().body(cartItems);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{itemKey}")
    public ResponseEntity<?> removeItemFromCart(@PathVariable String itemKey) {
        try {
            cartService.removeItemFromCart(itemKey);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur s'est produite lors de la suppression de l'élément du panier.");
        }
    }

    @PostMapping("/{userId}/{itemKey}")
    public ResponseEntity<Void> updateCartItemQuantity(@PathVariable String userId, @PathVariable String itemKey, @RequestParam int quantity) {
        try {
            cartService.updateCartItemQuantity(userId, itemKey, quantity);
            return ResponseEntity.ok().build();
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{userId}/{itemKey}/quantity")
    public ResponseEntity<Integer> getCartItemQuantity(@PathVariable String userId, @PathVariable String itemKey) {
        try {
            Integer quantity = cartService.getCartItemQuantity(userId, itemKey);
            return ResponseEntity.ok().body(quantity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
