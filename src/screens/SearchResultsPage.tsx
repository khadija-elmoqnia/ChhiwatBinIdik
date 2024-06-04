import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import Search from '../components/Search';
import { ScrollView } from 'react-native-virtualized-view';
import firestore from '@react-native-firebase/firestore';
import FoodCardClientOffFourn from '../components/FoodCardClientOffFourn'; // Adjust the import path as necessary

const SearchResultsPage = ({ route }) => {
  const { searchQuery } = route.params;
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    handleSearch(searchQuery);
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 500); // Delay to ensure navigation is complete before focusing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query) return;

    try {
      console.log(`Searching for: ${query}`);
      const querySnapshot = await firestore()
        .collection('plats')
        .get();

      const results = [];
      querySnapshot.forEach(documentSnapshot => {
        results.push({ ...documentSnapshot.data(), key: documentSnapshot.id });
      });

      // Filter results in a case-insensitive manner
      const filteredResults = results.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );

      console.log(`Results found: ${filteredResults.length}`);
      setSearchResults(filteredResults.length ? filteredResults : 'Aucun résultat trouvé');
    } catch (error) {
      console.error('Error searching for plats:', error);
      setSearchResults('Erreur lors de la recherche');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search onSearch={handleSearch} searchInputRef={searchInputRef} />
      </View>
      <ScrollView style={styles.scrollView}>
      <FlatList
        data={Array.isArray(searchResults) ? searchResults : []}
        renderItem={({ item }) => (
          <FoodCardClientOffFourn
            image={item.imageURL}
            title={item.title}
            price={item.price}
            itemKey={item.key}
          />
        )}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={<Text>{searchResults}</Text>}
      />
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  searchContainer: {
    marginBottom: 30,
  },
});

export default SearchResultsPage;