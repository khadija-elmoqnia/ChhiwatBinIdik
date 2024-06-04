package esi.ac.ma.ChehiwatBinIdik.Carts;

import com.google.cloud.firestore.annotation.DocumentId;

public class Cart {

    private String userId;
    private String itemKey;
    private String title;
    private Double price;
    private String imageURL;
    private int quantity;

    // Constructor with all fields
    public Cart(String userId, String itemKey, String title, Double price, String imageURL, int quantity) {
        this.userId = userId;
        this.itemKey = itemKey;
        this.title = title;
        this.price = price;
        this.imageURL = imageURL;
        this.quantity = quantity;
    }

    // Default constructor
    public Cart() {
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getItemKey() {
        return itemKey;
    }

    public void setItemKey(String itemKey) {
        this.itemKey = itemKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "Cart{" +
                "userId='" + userId + '\'' +
                ", itemKey='" + itemKey + '\'' +
                ", title='" + title + '\'' +
                ", price=" + price +
                ", imageURL='" + imageURL + '\'' +
                ", quantity=" + quantity +
                '}';
    }
}
