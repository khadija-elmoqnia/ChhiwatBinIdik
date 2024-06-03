import React from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';

const SearchResultsPage = ({ route }) => {
  // Récupérez les résultats de la recherche depuis les paramètres de route
  const { searchResults } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Image source={{ uri: item.imageURL }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{item.price}</Text>
            {/* Vous pouvez afficher d'autres détails des résultats ici */}
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  resultItem: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  price: {
    fontSize: 16,
    color: 'green',
  },
});

export default SearchResultsPage;
