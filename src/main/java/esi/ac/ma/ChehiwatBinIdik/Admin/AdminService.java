package esi.ac.ma.ChehiwatBinIdik.Admin;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import com.google.firebase.cloud.FirestoreClient;

@Service
public class AdminService {

    public String createAdmin(Admin admin) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = dbFirestore.collection("admin").document(admin.getDocumentid()).set(admin);
        return result.get().getUpdateTime().toString();
    }

    public Admin getAdmin(String documentId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("admin").document(documentId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(Admin.class);
        } else {
            return null;
        }
    }

    public String updateAdmin(Admin admin) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = dbFirestore.collection("admin").document(admin.getDocumentid()).set(admin);
        return result.get().getUpdateTime().toString();
    }

    public String deleteAdmin(String documentId) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = dbFirestore.collection("admin").document(documentId).delete();
        return "Successfully deleted admin with ID: " + documentId;
    }

    public Admin getAdminByEmail(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection("admin").whereEqualTo("email", email).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        if (!documents.isEmpty()) {
            return documents.get(0).toObject(Admin.class);
        } else {
            return null;
        }
    }

    public List<Admin> getAllAdmins() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference adminsCollection = dbFirestore.collection("admin");

        // Asynchronously retrieve all documents from the "admin" collection
        ApiFuture<QuerySnapshot> future = adminsCollection.get();

        // Blocks on response and gets the documents
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        // Initialize a list to store Admin objects
        List<Admin> admins = new ArrayList<>();

        // Iterate over the documents and convert each to an Admin object
        for (QueryDocumentSnapshot document : documents) {
            Admin admin = document.toObject(Admin.class);
            admins.add(admin);
        }

        return admins;
    }

}
