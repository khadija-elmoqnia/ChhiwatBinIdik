package esi.ac.ma.ChehiwatBinIdik.Plats;

import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.firestore.annotation.DocumentId;

public class Plat {
    @DocumentId
    private String document_id;
    private String title;
    private String description;
    private String price;
    private String categoryId;
    private String imageURL;
    private String fournisseurId;
    private String fournisseurName;

    public Plat() {}

    public Plat(String document_id, String title, String description, String price, String categoryId, String imageURL, String fournisseurId, String fournisseurName) {
        this.document_id = document_id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.imageURL = imageURL;
        this.fournisseurId = fournisseurId;
        this.fournisseurName = fournisseurName;
    }
    
    
    public String getFournisseurId() {
		return fournisseurId;
	}

	public void setFournisseurId(String fournisseurId) {
		this.fournisseurId = fournisseurId;
	}

	public String getFournisseurName() {
		return fournisseurName;
	}

	public void setFournisseurName(String fournisseurName) {
		this.fournisseurName = fournisseurName;
	}

	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}

	// Getters et setters
    public String getDocument_id() {
        return document_id;
    }

    public void setDocument_id(String document_id) {
        this.document_id = document_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
}
