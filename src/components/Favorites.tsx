import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import axios from 'axios';
 // Ensure you have Firebase auth configured

export const addFavorite = async (platId) => {
  const user = auth().currentUser;
  console.log('Attempting to add favorite for platId:', platId);
  if (user) {
    try {
      if (platId) {
        const response = await axios.post('http://192.168.1.138:8080/favorites/add', null, {
          params: {
            userId: user.uid,
            platId: platId,
          },
        });
        console.log(`Successfully added ${platId} to favorites:`, response.data);
      } else {
        console.error('platId is undefined, cannot add to favorites');
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  } else {
    console.log('No user logged in');
  }
};


export const removeFavorite = async (platId) => {
  const user = auth().currentUser;
  if (user) {
    try {
      const response = await axios.delete('http://192.168.1.138:8080/favorites/remove', {
        params: {
          userId: user.uid,
          platId: platId,
        },
      });
      console.log(`Successfully removed ${platId} from favorites:`, response.data);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  } else {
    console.log('No user logged in');
  }
};

export const fetchPlats = async () => {
  try {
    const snapshot = await firestore().collection('plats').get();
    const plats = [];
    snapshot.forEach(doc => {
      plats.push({ id: doc.id, ...doc.data() });
    });
    return plats;
  } catch (error) {
    console.error('Error fetching plats:', error);
    return [];
  }
};
export const fetchFavorites = async () => {
  const user = auth().currentUser;
  if (!user) return [];
  try {
    const response = await axios.get('http://192.168.1.138:8080/favorites/fetch', {
      params: {
        userId: user.uid,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};
// Function to periodically sync favorites with plats
export const syncFavoritesWithPlats = async () => {
  try {
    const plats = await fetchPlats();
    const favorites = await fetchFavorites();

    // Filter out favorites that are no longer present in plats
    const updatedFavorites = favorites.filter(favorite => plats.some(plat => plat.id === favorite));

    // Update favorites in Firestore
    const user = auth().currentUser;
    if (user) {
      await firestore().collection(`users/${user.uid}/favorites`).set(updatedFavorites);
      console.log('Favorites synced successfully');
    }
  } catch (error) {
    console.error('Error syncing favorites with plats:', error);
  }
};