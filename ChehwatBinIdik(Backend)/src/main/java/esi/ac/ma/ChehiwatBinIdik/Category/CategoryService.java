package esi.ac.ma.ChehiwatBinIdik.Category;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class CategoryService {

    private final String COLLECTION_NAME = "categories";

    public List<Category> getAllCategories() throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        CollectionReference categories = firestore.collection(COLLECTION_NAME);

        List<Category> categoryList = new ArrayList<>();
        categories.get().get().forEach(document -> {
            Category category = document.toObject(Category.class);
            categoryList.add(category);
        });

        return categoryList;
    }
}
