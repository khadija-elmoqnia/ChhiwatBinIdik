import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import search from './../../assets/images/search.png';

function Search({ searchInputRef }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    navigation.navigate('SearchResultsPage', { searchQuery });
  };

  const handleFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    handleSearch(); // Navigate to SearchResultsPage when the search bar is focused
  };

  return (
    <TouchableOpacity onPress={handleFocus} style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={search} style={styles.icon} />
        <TextInput
          ref={searchInputRef}
          style={styles.textInput}
          placeholder="Rechercher un plat"
          placeholderTextColor="gray"
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
          onFocus={handleSearch} // Trigger navigation when the input is focused
        />
      </View>
    </TouchableOpacity>
  );
}

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
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 35, // Icon width
    height: 35, // Icon height
    marginRight: 10, // Space between icon and text input
  },
  textInput: {
    flex: 1, // Prendre tout l'espace restant
    width: '100%',
  },
});

export default Search;
