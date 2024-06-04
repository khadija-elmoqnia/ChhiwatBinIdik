import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { getPlatsByCategory, deletePlat } from '../services/platservice';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuFourScreen = () => {
  const [plats, setPlats] = useState([]);
  const [categoryId, setCategoryId] = useState('desserts');
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchPlats();
    }
  }, [isFocused, categoryId]);

  const fetchPlats = async () => {
    try {
      const fournisseurId = await AsyncStorage.getItem('fournisseurId');
      console.log('Fournisseur ID récupéré:', fournisseurId); // Log pour vérifier
      if (fournisseurId) {
        const platsData = await getPlatsByCategory(categoryId, fournisseurId);
        setPlats(platsData);
      } else {
        console.error('Fournisseur ID non trouvé');
      }
    } catch (error) {
      console.error('Error fetching plats:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les plats. Veuillez réessayer plus tard.');
    }
  };

  const handleDeletePlat = async (documentId) => {
    try {
      const fournisseurId = await AsyncStorage.getItem('fournisseurId');
      console.log('Fournisseur ID récupéré pour suppression:', fournisseurId); // Log pour vérifier
      if (fournisseurId) {
        await deletePlat(documentId, fournisseurId);
        fetchPlats();
      } else {
        console.error('Fournisseur ID non trouvé');
      }
    } catch (error) {
      console.error('Error deleting plat:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le plat. Veuillez réessayer plus tard.');
    }
  };

  const handleNavigationToAddPlat = () => {
    navigation.navigate('AddPlat', { onGoBack: fetchPlats });
  };

  const handleNavigationToEditPlat = (plat) => {
    navigation.navigate('EditPlat', { plat, onGoBack: fetchPlats });
  };

  const renderPlat = ({ item }) => (
    <View style={styles.platContainer}>
      <Image source={{ uri: item.imageURL }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{item.price} €</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigationToEditPlat(item)}>
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeletePlat(item.document_id)}>
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleNavigationToAddPlat}>
        <Text style={styles.addButtonText}>Ajouter un plat</Text>
      </TouchableOpacity>
      <FlatList
        data={plats}
        keyExtractor={(item) => item.document_id}
        renderItem={renderPlat}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#FF4B3A',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    marginTop: 20,
  },
  platContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FF4B3A',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default MenuFourScreen;