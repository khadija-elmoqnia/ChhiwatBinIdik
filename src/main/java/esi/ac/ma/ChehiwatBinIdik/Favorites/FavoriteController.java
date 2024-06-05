package esi.ac.ma.ChehiwatBinIdik.Favorites;

import java.util.List;
import java.util.concurrent.ExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/add")
    public ResponseEntity<String> addFavorite(@RequestParam String userId, @RequestParam String platId) {
        try {
            String result = favoriteService.addFavorite(userId, platId);
            return ResponseEntity.ok("Successfully added " + platId + " to favorites at " + result);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding favorite: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFavorite(@RequestParam String userId, @RequestParam String platId) {
        try {
            String result = favoriteService.removeFavorite(userId, platId);
            return ResponseEntity.ok(result);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error removing favorite: " + e.getMessage());
        }
    }
    
    @GetMapping("/fetch")
    public ResponseEntity<List<String>> fetchFavorites(@RequestParam String userId) {
        try {
            List<String> favoritePlatIds = favoriteService.fetchFavorites(userId);
            return ResponseEntity.ok(favoritePlatIds);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
