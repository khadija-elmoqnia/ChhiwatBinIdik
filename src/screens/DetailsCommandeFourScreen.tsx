import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DetailsCommandeFourScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { commande } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Titre: {item.title}</Text>
      <Text style={styles.itemText}>Quantité: {item.quantity}</Text>
      <Text style={styles.itemText}>Prix: {item.price} €</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Détails de la Commande</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>Commande ID: {commande.id}</Text>
        <Text style={styles.detailText}>Date: {commande.createdAt.toDate().toLocaleDateString()}</Text>
        <Text style={styles.detailText}>Adresse: {commande.address}</Text>
        <Text style={styles.detailText}>Montant Total: {commande.totalPrice} €</Text>
      </View>
      <Text style={styles.itemsHeader}>Articles:</Text>
      <FlatList
        data={commande.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.itemsList}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  itemsHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  itemsList: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
  },
  backButton: {
    padding: 15,
    backgroundColor: '#FF4B3A',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DetailsCommandeFourScreen;