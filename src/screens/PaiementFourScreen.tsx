import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaiementFourScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const fournisseurId = await AsyncStorage.getItem('fournisseurId');
        const snapshot = await firestore()
          .collection('commandes')
          .where('statusFournisseur', '==', 'livree')
          .get();

        const transactionsData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(commande => commande.items.some(item => item.fournisseurId === fournisseurId));

        const total = transactionsData.reduce((sum, transaction) => sum + transaction.totalPrice, 0);
        setTransactions(transactionsData);
        setTotalBalance(total);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <Text style={styles.transactionText}>ID de la Commande: {item.id}</Text>
      <Text style={styles.transactionText}>Montant Total: {item.totalPrice} MAD</Text>
      <Text style={styles.transactionText}>Date: {item.createdAt.toDate().toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions et Paiements</Text>
      <Text style={styles.totalBalance}>Solde Total: {totalBalance} MAD</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.transactionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  totalBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionList: {
    paddingBottom: 20,
  },
  transactionCard: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});

export default PaiementFourScreen;