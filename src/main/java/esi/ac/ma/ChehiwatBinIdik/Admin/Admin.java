
package esi.ac.ma.ChehiwatBinIdik.Admin;

import com.google.cloud.firestore.annotation.DocumentId;



public class Admin {

    @DocumentId
    String documentid;
    private String firstName;
    private String password;
    private String email;
    private String lastName;
    private Integer phoneNumber;
    private String avatar;

    // Constructors
    public Admin() {}

    public Admin(String username, String password, String email, String fullName, Integer phoneNumber,String avatar) {
        this.firstName = username;
        this.password = password;
        this.email = email;
        this.lastName = fullName;
        this.phoneNumber = phoneNumber;
        this.avatar=avatar;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public Integer getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(Integer phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDocumentid() {
        return documentid;
    }

    public void setDocumentid(String documentid) {
        this.documentid = documentid;
    }

}

