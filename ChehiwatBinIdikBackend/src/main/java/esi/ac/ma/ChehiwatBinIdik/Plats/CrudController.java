package esi.ac.ma.ChehiwatBinIdik.Plats;

import org.springframework.beans.factory.annotation.Autowired;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.firebase.cloud.FirestoreClient;

import java.util.List;


import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/plats")
public class CrudController {

    @Autowired
    private PlatService platService;

    @PostMapping("/create")
    public ResponseEntity<String> createPlat(@RequestBody Plat plat) throws InterruptedException, ExecutionException {
        String result = platService.createCRUD(plat);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/get")
    public Plat getPlat(@RequestParam String document_id) throws InterruptedException, ExecutionException {
        return platService.getCRUD(document_id);
    }
    
    @GetMapping("/parCategorie")
    public ResponseEntity<List<Plat>> getPlatsByCategory(@RequestParam String categoryId) {
        try {
            List<Plat> plats = platService.getPlatsByCategory(categoryId);
            return ResponseEntity.ok(plats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/update")
    public ResponseEntity<String> updatePlat(@RequestBody Plat plat) throws InterruptedException, ExecutionException {
        String result = platService.updateCRUD(plat);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deletePlat(@RequestParam String document_id) throws InterruptedException, ExecutionException {
        String result = platService.deleteCRUD(document_id);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/byCategoryAndFournisseur")
    public ResponseEntity<List<Plat>> getPlatsByCategoryAndFournisseur(@RequestParam String categoryId, @RequestParam String fournisseurId) {
        try {
            List<Plat> plats = platService.getPlatsByCategoryAndFournisseur(categoryId, fournisseurId);
            return ResponseEntity.ok(plats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
   

}
