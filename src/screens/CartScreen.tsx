import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import backIcon from './../../assets/images/back.png';
import backIcon2 from './../../assets/images/backk.png';

function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userId = user.uid;
          const response = await axios.get(`http://192.168.1.138:8080/api/carts/${userId}`);
          let cartItems = response.data;

          // Fetch additional details from Firestore
          for (let i = 0; i < cartItems.length; i++) {
            const itemDoc = await firestore().collection('plats').doc(cartItems[i].itemKey).get();
            if (itemDoc.exists) {
              cartItems[i].fournisseurId = itemDoc.data().fournisseurId || 'unknown';
              cartItems[i].imageURL = itemDoc.data().imageURL || 'unknown';
              const ratingsSnapshot = await firestore().collection('plats').doc(cartItems[i].itemKey).collection('ratings').get();
              if (!ratingsSnapshot.empty) {
                let totalRating = 0;
                ratingsSnapshot.forEach(doc => {
                  totalRating += doc.data().rating;
                });
                cartItems[i].averageRating = totalRating / ratingsSnapshot.size;
              } else {
                cartItems[i].averageRating = 0;
              }
            } else {
              cartItems[i].fournisseurId = 'unknown';
              cartItems[i].imageURL = 'unknown';
              cartItems[i].averageRating = 0;
            }
          }

          setCartItems(cartItems);
        } else {
          Alert.alert('Erreur', 'Vous devez être connecté pour voir votre panier.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des éléments du panier:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateCartItemQuantity = async (userId, itemKey, quantity) => {
    try {
      await axios.post(`http://192.168.1.138:8080/api/carts/${userId}/${itemKey}`, null, { params: { quantity } });
      const cartItemRef = firestore()
        .collection('carts')
        .doc(userId)
        .collection('items')
        .doc(itemKey);

      await cartItemRef.set(
        { quantity: quantity },
        { merge: true }
      );

      console.log(`Successfully updated quantity for ${itemKey}`);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const response = await axios.delete(`http://192.168.1.138:8080/api/carts/${item.itemKey}`);
      console.log(response.data);
      setCartItems(prevItems => prevItems.filter(cartItem => cartItem.itemKey !== item.itemKey));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément:', error);
      Alert.alert('Erreur', `Erreur lors de la suppression de l'élément: ${error.message}`);
    }
  };

  const handleIncreaseQuantity = async (item) => {
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      const newQuantity = item.quantity + 1;
      await updateCartItemQuantity(userId, item.itemKey, newQuantity);
      setCartItems(prevItems => prevItems.map(cartItem =>
        cartItem.itemKey === item.itemKey ? { ...cartItem, quantity: newQuantity } : cartItem
      ));
    }
  };

  const handleDecreaseQuantity = async (item) => {
    const user = auth().currentUser;
    if (user && item.quantity > 1) {
      const userId = user.uid;
      const newQuantity = item.quantity - 1;
      await updateCartItemQuantity(userId, item.itemKey, newQuantity);
      setCartItems(prevItems => prevItems.map(cartItem =>
        cartItem.itemKey === item.itemKey ? { ...cartItem, quantity: newQuantity } : cartItem
      ));
    }
  };

  const handleProceedToPayment = () => {
    const totalAmount = calculateTotalPrice();
    const user = auth().currentUser;

    if (user) {
      const itemsWithDetails = cartItems.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        fournisseurId: item.fournisseurId || 'unknown',
        imageURL: item.imageURL || 'unknown',
        averageRating: item.averageRating || 0,
      }));

      navigation.navigate('pay', {
        amount: totalAmount,
        items: itemsWithDetails,
        userId: user.uid,
      });
    } else {
      Alert.alert('Erreur', 'Vous devez être connecté pour passer une commande.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageURL }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price} dh</Text>
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => handleDecreaseQuantity(item)} style={styles.quantityButton}>
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => handleIncreaseQuantity(item)} style={styles.quantityButton}>
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.deleteButton}>
        <Image source={backIcon} style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
  );

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  };

  const generateSummary = () => {
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = calculateTotalPrice();

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total : {totalPrice} dh</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B3A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={backIcon2} style={styles.backIcon2} />
      </TouchableOpacity>
      <Text style={styles.header}>Panier</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Votre panier est vide.</Text>}
        contentContainerStyle={styles.cartList}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      />
      {generateSummary()}
      <TouchableOpacity style={styles.paymentButton} onPress={handleProceedToPayment}>
        <Text style={styles.paymentButtonText}>Valider la commande</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 19,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
    marginTop: 2,
    marginBottom: 80,
  },
  cartList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#555',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    position: 'relative',
    marginTop: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  price: {
    fontSize: 16,
    color: '#FF4B3A',
    marginTop: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4B3A',
    borderRadius: 30,
    paddingHorizontal: 3,
    paddingVertical: 2,
    marginTop: 30,
    marginRight: 28,
  },
  quantityButton: {
    paddingHorizontal: 5,
  },
  quantityText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  paymentButton: {
    backgroundColor: '#FF4B3A',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paymentButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backIcon2: {
    width: 24,
    height: 24,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
});

export default CartScreen;
