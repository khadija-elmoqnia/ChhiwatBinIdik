import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FoodDetailCard from '../components/FoodDetailCard';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import database from '@react-native-firebase/database';


        const getUserData = async (userId) => {
        try {
        const userSnapshot = await database().ref(`/users/${userId}`).once('value');
    return userSnapshot.val();
  } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
            }
            };

function FoodDetailScreen({ route, navigation }) {
        const { itemKey } = route.params;
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

useEffect(() => {
        const fetchInitialData = async () => {
        try {
        const user = auth().currentUser;
        if (user) {
        const foodDoc = await firestore().collection('plats').doc(itemKey).get();
          if (foodDoc.exists) {
        const foodData = foodDoc.data();
            const fournisseurData = await getUserData(foodData.fournisseurId);
            const fournisseurName = fournisseurData ? fournisseurData.fullName : 'Nom du fournisseur non disponible';
setFood({ ...foodData, fournisseurName, fournisseurId: foodData.fournisseurId });
        } else {
        console.error('Plat non trouvé');
          }

                  const cartItemDoc = await firestore()
            .collection('carts')
            .doc(user.uid)
            .collection('items')
            .doc(itemKey)
            .get();
          if (cartItemDoc.exists) {
        const initialQuantity = cartItemDoc.data().quantity;
setQuantity(initialQuantity > 0 ? initialQuantity : 1);
          }
                  } else {
                  console.error('Vous devez être connecté pour récupérer les données.');
        }
                } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
setLoading(false);
      }
              };

fetchInitialData();
  }, [itemKey]);


        const updateFoodQuantity = (newQuantity) => {
            setQuantity(newQuantity);
        };


          const handleIncreaseQuantity = () => {
              const newQuantity = quantity + 1;
              updateFoodQuantity(newQuantity);


          };

          const handleDecreaseQuantity = () => {
              if (quantity > 1) {
                  const newQuantity = quantity - 1;
                  updateFoodQuantity(newQuantity);


              }
          };

            const handleAddToCart = async () => {
        try {
        const user = auth().currentUser;
      if (user) {
        const cartItemRef = firestore()
          .collection('carts')
          .doc(user.uid)
          .collection('items')
          .doc(itemKey);

await cartItemRef.set({
    title: food?.title || "Titre non disponible",
            price: food?.price || 0,
            imageURL: food?.imageURL || "https://via.placeholder.com/250",
            quantity: quantity,
}, { merge: true });

await axios.post('http://192.168.1.138:8080/api/carts', {
    userId: user.uid,
            itemKey: itemKey,
            title: food?.title || "Titre non disponible",
            price: food?.price || 0,
            imageURL: food?.imageURL || "https://via.placeholder.com/250",
            quantity: quantity,
});

        console.log('Article ajouté au panier');
      } else {
              console.error('Erreur', 'Vous devez être connecté pour ajouter un article au panier.');
      }
              } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
    }
            };

            if (loading) {
        return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
        );
        }
        if (!food) {
        return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Plat non trouvé</Text>
      </View>
        );
        }

        return (
    <View style={styles.container}>
      <FoodDetailCard
image={food.imageURL}
title={food.title}
price={food.price}
description={food.description}
platDocId={itemKey}
quantity={quantity}
fournisseur={food.fournisseurName}
fournisseurId={food.fournisseurId}
onIncreaseQuantity={handleIncreaseQuantity}
onDecreaseQuantity={handleDecreaseQuantity}
onAddToCart={handleAddToCart}
        />
    </View>
        );
        }
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white', // Set the background color to green
            padding : 10,
          },
          loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          errorText: {
            textAlign: 'center',
            fontSize: 18,
            color: 'red',
          },

        });
export default FoodDetailScreen;