package esi.ac.ma.ChehiwatBinIdik.Admin;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/admins")
public class adminfirebase_controler {

    @Autowired
    private AdminService adminService;

    @PostMapping("/create")
    public ResponseEntity<String> createAdmin(@RequestBody Admin admin) {
        try {
            String result = adminService.createAdmin(admin);
            return ResponseEntity.ok("Admin created successfully at " + result);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(500).body("Error creating admin: " + e.getMessage());
        }
    }

    @GetMapping("/getadmin/{documentId}")
    public ResponseEntity<Admin> getAdmin(@PathVariable String documentId) {
        try {
            Admin admin = adminService.getAdmin(documentId);
            if (admin != null) {
                return ResponseEntity.ok(admin);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateAdmin(@RequestBody Admin admin) {
        try {
            String result = adminService.updateAdmin(admin);
            return ResponseEntity.ok("Admin updated successfully at " + result);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(500).body("Error updating admin: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{documentId}")
    public ResponseEntity<String> deleteAdmin(@PathVariable String documentId) {
        try {
            String result = adminService.deleteAdmin(documentId);
            return ResponseEntity.ok(result);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(500).body("Error deleting admin: " + e.getMessage());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<String> authenticateAdmin(@RequestParam String email, @RequestParam String password) {
        try {
            Admin admin = adminService.getAdminByEmail(email);
            if (admin != null && admin.getPassword().equals(password)) {
                return ResponseEntity.ok("Authentication successful");
            } else {
                return ResponseEntity.status(401).body("Authentication failed: Invalid email or password");
            }
        } catch (ExecutionException e) {
            return ResponseEntity.status(500).body("Error during authentication: " + e.getMessage());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        try {
            List<Admin> admins = adminService.getAllAdmins();

            // Log the size of the list returned
            System.out.println("Number of admins returned: " + admins.size());

            return ResponseEntity.ok(admins);
        } catch (InterruptedException | ExecutionException e) {
            // Log the error
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
