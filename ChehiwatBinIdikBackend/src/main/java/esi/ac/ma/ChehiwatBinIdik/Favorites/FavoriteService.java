package esi.ac.ma.ChehiwatBinIdik.Favorites;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.springframework.stereotype.Service;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FavoriteService {

    private static final Logger logger = LoggerFactory.getLogger(FavoriteService.class);
    private final Firestore dbFirestore = FirestoreClient.getFirestore();

    public String addFavorite(String userId, String platId) throws InterruptedException, ExecutionException {
        DocumentReference docRef = dbFirestore.collection("users").document(userId).collection("favorites").document(platId);
        ApiFuture<WriteResult> result = docRef.set(new Favorite(true));
        logger.info("Successfully added {} to favorites for user {}", platId, userId);
        return result.get().getUpdateTime().toString();
    }

    public String removeFavorite(String userId, String platId) throws InterruptedException, ExecutionException {
        DocumentReference docRef = dbFirestore.collection("users").document(userId).collection("favorites").document(platId);
        ApiFuture<WriteResult> result = docRef.delete();
        logger.info("Successfully removed {} from favorites for user {}", platId, userId);
        return "Successfully deleted " + platId + " from favorites";
    }
    
    public List<String> fetchFavorites(String userId) throws InterruptedException, ExecutionException {
        CollectionReference favoritesRef = dbFirestore.collection("users").document(userId).collection("favorites");
        ApiFuture<QuerySnapshot> querySnapshot = favoritesRef.get();

        List<String> favoritePlatIds = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            favoritePlatIds.add(document.getId());
        }

        logger.info("Successfully fetched favorites for user {}", userId);
        return favoritePlatIds;
    }

    public static class Favorite {
        private boolean favorite;

        public Favorite() {}

        public Favorite(boolean favorite) {
            this.favorite = favorite;
        }

        public boolean isFavorite() {
            return favorite;
        }

        public void setFavorite(boolean favorite) {
            this.favorite = favorite;
        }
    }
}
