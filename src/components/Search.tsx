import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import search from './../../assets/images/search.png';
import firestore from '@react-native-firebase/firestore';

function Search({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    // Interroger Firestore pour rechercher des plats correspondant à la requête de recherche
    try {
      const querySnapshot = await firestore()
        .collection('plats')
        .where('title', '>=', searchQuery)
        .where('title', '<=', searchQuery + '\uf8ff') // Utilisation de la technique de préfixe-suffixe pour rechercher des résultats proches
        .get();

      // Convertir les résultats de la requête en un tableau de plats
      const results = [];
      querySnapshot.forEach(documentSnapshot => {
        results.push(documentSnapshot.data());
      });

      // Passer les résultats de la recherche à la fonction de rappel fournie par le composant parent
      if (results.length === 0) {
        onSearch('Aucun résultat trouvé');
      } else {
        onSearch(results);
      }
    } catch (error) {
      console.error('Error searching for plats:', error);
      onSearch('Erreur lors de la recherche');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={search} style={styles.icon} />
      <TextInput
        style={styles.textInput}
        placeholder="Rechercher un plat"
        placeholderTextColor="gray"
        onChangeText={text => setSearchQuery(text)}
        onSubmitEditing={handleSearch} // Appeler la fonction de recherche lorsque l'utilisateur appuie sur la touche "Entrée"
      />
    </View>
  );
}

// Styles pour le composant Search
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0', // Changer la couleur de fond de la barre de recherche en gris clair
    width: '88%', // Largeur de la vue
    height: 40,
    alignSelf: 'center', // Alignement au centre
    borderRadius: 20, // Bord arrondi
    justifyContent: 'center', // Centrage vertical
    alignItems: 'center', // Centrage horizontal
    paddingLeft: 30, // Marge à gauche
    marginBottom: -20, // Marge en bas
  },
  icon: {
    width: 35, // Icon width
    height: 35, // Icon height
    marginRight: 10, // Space between icon and text input
    marginBottom: 0,
  },
  textInput: {
    flex: 1, // Prendre tout l'espace restant
    width: '100%',
  },
});

export default Search; // Export du composant Search
