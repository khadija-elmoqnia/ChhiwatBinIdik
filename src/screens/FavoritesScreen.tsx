import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { fetchFavorites, fetchPlats } from '../components/Favorites'; // Ensure the path is correct
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FoodCardClient from '../components/FoodCardClient'; // Ensure the path is correct
import backIcon2 from './../../assets/images/backk.png'; // Import the back icon

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [plats, setPlats] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritePlatIds = await fetchFavorites();
        setFavorites(favoritePlatIds);

        const unsubscribe = firestore().collection(`users/${user?.uid}/favorites`).onSnapshot(snapshot => {
          const updatedFavorites = snapshot.docs.map(doc => doc.id);
          setFavorites(updatedFavorites);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    const loadPlats = async () => {
      try {
        const allPlats = await fetchPlats();
        setPlats(allPlats);
      } catch (error) {
        console.error('Error loading plats:', error);
      }
    };

    if (user) {
      loadFavorites();
    }

    loadPlats();
  }, [user]);

  useEffect(() => {
    const filterFavoritePlats = () => {
      const filtered = plats.filter(plat => favorites.includes(plat.id));
      setFilteredFavorites(filtered);
    };

    filterFavoritePlats();
  }, [plats, favorites]);

  if (!user) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backIcon2} style={styles.backIcon} />
        </TouchableOpacity>
        <View>
          <Text style={styles.header1}>Liste des favoris</Text>
        </View>
        <Text style={styles.loginMessage}>Connectez-vous pour afficher la liste des {'\n'} favoris</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={backIcon2} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.header}>Liste des favoris</Text>
      <FlatList
        data={filteredFavorites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FoodCardClient
            image={item.imageURL}
            title={item.title}
            price={item.price}
            fournisseur={item.fournisseur}
            fournisseurId={item.fournisseurId}
            itemKey={item.id}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun élément favori pour le moment</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  header: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: 'black',
    marginBottom: 20,
    marginTop: 18,
    textAlign: 'center',
  },
  header1: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: 'black',
    marginBottom: 20,
    marginTop: -300,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 300,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Raleway',
  },
  loginMessage: {
    padding: 10,
    fontSize: 18,
    fontFamily: 'Raleway',
  },
});

export default FavoritesScreen;
