import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { addFavorite, fetchFavorites, removeFavorite } from '../components/Favorites';
import RatingInput from './RatingInput';
import AverageRating from './AverageRating';

import favorieImage from './../../assets/images/favorie.png';
import favoriteSelectedImage from './../../assets/images/favorite-selected.png';
import backIcon2 from './../../assets/images/backk.png';

function FoodDetailCard({ image, title, price, description, platDocId, quantity, fournisseur, fournisseurId, onIncreaseQuantity, onDecreaseQuantity, onAddToCart }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const user = auth().currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Received platDocId:', platDocId);
    const fetchPlatDetails = async () => {
      try {
        if (user) {
          const favoritePlatIds = await fetchFavorites();
          setIsFavorite(favoritePlatIds.includes(platDocId));
        }
      } catch (error) {
        console.error('Error fetching plat details:', error);
      }
    };

    if (platDocId) {
      fetchPlatDetails();
    } else {
      console.error('platDocId is undefined');
    }
  }, [platDocId, user]);

  const handleFavoriteToggle = async () => {
    if (user) {
      try {
        if (isFavorite) {
          console.log('Removing from favorites:', platDocId);
          await removeFavorite(platDocId);
          console.log(`Removed ${platDocId} from favorites`);
        } else {
          console.log('Adding to favorites:', platDocId);
          await addFavorite(platDocId);
          console.log(`Added ${platDocId} to favorites`);
        }
        setIsFavorite(!isFavorite);
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    } else {
      console.log('No user logged in');
    }
  };

  const handleFournisseurPress = () => {
    navigation.navigate('Fournisseur', { fournisseurId, fournisseurName: fournisseur });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={backIcon2} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails du plat</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            onError={(error) => console.error('Error loading image:', error)}
          />
          <View style={styles.averageRatingContainer}>
            <AverageRating platId={platDocId} />
          </View>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
          <Image
            source={isFavorite ? favoriteSelectedImage : favorieImage}
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.priceQuantityContainer}>
          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={handleFournisseurPress}>
              <Text style={styles.fournisseur}>Chef: {fournisseur}</Text>
            </TouchableOpacity>
            <Text style={styles.price}>{price} MAD</Text>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={onDecreaseQuantity}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={onIncreaseQuantity}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.ratingInputContainer}>
          <RatingInput platId={platDocId} />
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
          <Text style={styles.addToCartText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%',
    padding: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Raleway-Bold',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  averageRatingContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 3,
    paddingBottom:13,
    paddingLeft:-8,
    paddingRight:8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  favoriteIcon: {
    width: 27,
    height: 27,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  leftContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  fournisseur: {
    fontSize: 15,
    color: 'black',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    color: '#FF4B3A',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4B3A',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  ratingInputContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#FF4B3A',
        borderRadius: 15,
        height: 50,
        width: '94%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
  },
  addToCartText: {
     color: '#fff',
       fontSize: 18,
       fontWeight: 'bold',
  },
});

export default FoodDetailCard;