package esi.ac.ma.ChehiwatBinIdik.Plats;


import java.util.concurrent.ExecutionException;
import org.springframework.stereotype.Service;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PlatService {

	private static final Logger logger = LoggerFactory.getLogger(PlatService.class);
    private final Firestore dbFirestore = FirestoreClient.getFirestore();


    public String createCRUD(Plat plat) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference docRef = dbFirestore.collection("plats").document(); // Automatically generates a unique ID
        plat.setDocument_id(docRef.getId()); // Set the generated ID to the Plat object
        logger.info("Creating plat with auto-generated ID: {}", plat.getDocument_id());
        ApiFuture<WriteResult> result = docRef.set(plat);
        logger.info("Plat created at time: {}", result.get().getUpdateTime());
        return result.get().getUpdateTime().toString();
    }


    public Plat getCRUD(String documentId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("plats").document(documentId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(Plat.class);
        } else {
            return null;
        }
    }

    public String updateCRUD(Plat plat) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = dbFirestore.collection("plats").document(plat.getDocument_id()).set(plat);
        return result.get().getUpdateTime().toString();
    }

    public String deleteCRUD(String documentId) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = dbFirestore.collection("plats").document(documentId).delete();
        return "Successfully deleted " + documentId;
    }

    public List<Plat> getPlatsByCategory(String categoryId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference platsRef = db.collection("plats");

        Query query = platsRef.whereEqualTo("categoryId", categoryId);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        List<Plat> plats = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            Plat plat = document.toObject(Plat.class);
            plats.add(plat);
        }
        return plats;
    }
    
    public List<Plat> getPlatsByCategoryAndFournisseur(String categoryId, String fournisseurId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference platsRef = db.collection("plats");

        Query query = platsRef.whereEqualTo("categoryId", categoryId).whereEqualTo("fournisseurId", fournisseurId);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        List<Plat> plats = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            Plat plat = document.toObject(Plat.class);
            plats.add(plat);
        }
        return plats;
    }
    


    
    
    
    
}
