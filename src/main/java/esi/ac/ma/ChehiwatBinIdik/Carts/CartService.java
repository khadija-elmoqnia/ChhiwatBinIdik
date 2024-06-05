package esi.ac.ma.ChehiwatBinIdik.Carts;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class CartService {

    private static final String COLLECTION_NAME = "carts";

    public void addToCart(Cart cart) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        List<QueryDocumentSnapshot> documents = dbFirestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", cart.getUserId())
                .whereEqualTo("itemKey", cart.getItemKey())
                .get()
                .get()
                .getDocuments();

        if (!documents.isEmpty()) {
            QueryDocumentSnapshot documentSnapshot = documents.get(0);
            String documentId = documentSnapshot.getId();
            int currentQuantity = documentSnapshot.getLong("quantity").intValue();
            dbFirestore.collection(COLLECTION_NAME).document(documentId).update("quantity", currentQuantity + cart.getQuantity());
        } else {
            dbFirestore.collection(COLLECTION_NAME).add(cart);
        }
    }

    public List<Cart> getCartItemsByUserId(String userId) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference cartsCollection = dbFirestore.collection(COLLECTION_NAME);

        Query query = cartsCollection.whereEqualTo("userId", userId);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        List<Cart> cartItems = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            cartItems.add(document.toObject(Cart.class));
        }

        return cartItems;
    }
    
    public void removeItemFromCart(String itemKey) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = dbFirestore.collection(COLLECTION_NAME)
                .whereEqualTo("itemKey", itemKey)
                .get();

        List<QueryDocumentSnapshot> documents = querySnapshotApiFuture.get().getDocuments();
        if (!documents.isEmpty()) {
            QueryDocumentSnapshot documentSnapshot = documents.get(0);
            String documentId = documentSnapshot.getId();
            dbFirestore.collection(COLLECTION_NAME).document(documentId).delete();
        } else {
            throw new RuntimeException("L'élément du panier avec l'itemKey " + itemKey + " n'existe pas.");
        }
    }
    
    public void updateCartItemQuantity(String userId, String itemKey, int quantity) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference cartsCollection = dbFirestore.collection(COLLECTION_NAME);

        Query query = cartsCollection.whereEqualTo("userId", userId).whereEqualTo("itemKey", itemKey);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
        if (!documents.isEmpty()) {
            QueryDocumentSnapshot documentSnapshot = documents.get(0);
            String documentId = documentSnapshot.getId();
            dbFirestore.collection(COLLECTION_NAME).document(documentId).update("quantity", quantity);
        } else {
            throw new RuntimeException("Cart item not found");
        }
    }
    
    
    public void updateCartIDetailtemQuantity(String userId, String itemKey, int quantity) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference cartsCollection = dbFirestore.collection(COLLECTION_NAME);

        Query query = cartsCollection.whereEqualTo("userId", userId).whereEqualTo("itemKey", itemKey);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
        if (!documents.isEmpty()) {
            QueryDocumentSnapshot documentSnapshot = documents.get(0);
            String documentId = documentSnapshot.getId();
            dbFirestore.collection(COLLECTION_NAME).document(documentId).update("quantity", quantity);
        } else {
            throw new RuntimeException("Cart item not found");
        }
    }
    
    public Integer getCartItemQuantity(String userId, String itemKey) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        Query query = dbFirestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .whereEqualTo("itemKey", itemKey);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();

        if (!documents.isEmpty()) {
            QueryDocumentSnapshot documentSnapshot = documents.get(0);
            return documentSnapshot.getLong("quantity").intValue();
        } else {
            return 0; // or throw an exception if the item should exist
        }
    }

}
