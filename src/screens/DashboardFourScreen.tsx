import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Item {
  fournisseurId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Commande {
  id: string;
  address: string;
  createdAt: any;
  items: Item[];
  statusClient: string;
  statusFournisseur: string;
  totalPrice: number;
  userId: string;
}

const DashboardFourScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState<'nouvelle' | 'encours' | 'refusee' | 'livree'>('nouvelle');
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [filteredCommandes, setFilteredCommandes] = useState<Commande[]>([]);
  const [fullName, setFullName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFournisseurInfo = async () => {
      try {
        const fournisseurId = await AsyncStorage.getItem('fournisseurId');
        console.log('Fournisseur ID retrieved from AsyncStorage:', fournisseurId); // Debug log

        if (!fournisseurId) {
          Alert.alert('Erreur', 'ID du fournisseur non trouvé.');
          return;
        }

        const snapshot = await database().ref(`/users/${fournisseurId}`).once('value');
        const fournisseurData = snapshot.val();
        console.log('Fournisseur document data:', fournisseurData); // Debug log

        if (fournisseurData && fournisseurData.role === 'fournisseur') {
          setFullName(fournisseurData.fullName || 'Fournisseur');
        } else {
          console.error('Fournisseur document does not exist or role is not fournisseur.');
          Alert.alert('Erreur', 'Document fournisseur non trouvé ou le rôle est incorrect.');
        }
      } catch (error) {
        console.error('Error fetching fournisseur info:', error);
        Alert.alert('Erreur', 'Impossible de récupérer les informations du fournisseur.');
      }
    };

    fetchFournisseurInfo();
  }, []);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const fournisseurId = await AsyncStorage.getItem('fournisseurId');
        console.log('Fournisseur ID for fetching commandes:', fournisseurId); // Debug log

        if (!fournisseurId) {
          Alert.alert('Erreur', 'ID du fournisseur non trouvé.');
          return;
        }

        const snapshot = await firestore().collection('commandes').get();
        const commandesData: Commande[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Commande));

        console.log('Fetched Commandes:', commandesData);

        const filteredByFournisseurId = commandesData.filter(commande =>
          commande.items.some(item => item.fournisseurId === fournisseurId)
        );

        console.log('Filtered Commandes by fournisseurId:', filteredByFournisseurId);

        setCommandes(filteredByFournisseurId);
      } catch (error) {
        console.error('Error fetching commandes:', error);
        Alert.alert('Erreur', 'Impossible de récupérer les commandes.');
      }
    };

    fetchCommandes();
  }, []);

  useEffect(() => {
    const filterCommandes = () => {
      const filtered = commandes.filter(commande =>
        commande.statusFournisseur.trim().toLowerCase() === selectedFilter.trim().toLowerCase()
      );
      setFilteredCommandes(filtered);
      console.log('Filtered Commandes:', filtered);
    };

    filterCommandes();
  }, [selectedFilter, commandes]);

  const handleUpdateStatus = async (commandeId: string, newStatus: string) => {
    try {
      await firestore().collection('commandes').doc(commandeId).update({
        statusFournisseur: newStatus,
      });
      setCommandes(prevCommandes =>
        prevCommandes.map(commande =>
          commande.id === commandeId ? { ...commande, statusFournisseur: newStatus } : commande
        )
      );
    } catch (error) {
      console.error('Error updating commande status:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut de la commande.');
    }
  };

  const renderCommande = ({ item }: { item: Commande }) => (
    <View style={styles.commandeCard}>
      <View style={styles.commandeHeader}>
        <Text style={styles.commandeTitle}>Commande #{item.id}</Text>
        <Text style={styles.commandeDate}>{item.createdAt.toDate().toLocaleDateString()}</Text>
      </View>
      <Text style={styles.commandeDetail}>Montant Total: {item.totalPrice} MAD</Text>
      <Text style={styles.commandeDetail}>Adresse: {item.address}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('DetailsCommandeFour', { commande: item })}>
        <Text style={styles.detailsButton}>Détails</Text>
      </TouchableOpacity>
      {selectedFilter === 'nouvelle' && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={() => handleUpdateStatus(item.id, 'encours')}>
            <Text style={styles.actionButtonText}>Accepter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => handleUpdateStatus(item.id, 'refusee')}>
            <Text style={styles.actionButtonText}>Refuser</Text>
          </TouchableOpacity>
        </View>
      )}
      {selectedFilter === 'encours' && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.deliveredButton]} onPress={() => handleUpdateStatus(item.id, 'livree')}>
            <Text style={styles.actionButtonText}>Livrée</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => handleUpdateStatus(item.id, 'refusee')}>
            <Text style={styles.actionButtonText}>Refuser</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bonjour, {fullName}</Text>
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedFilter('nouvelle')}
        >
          <Text style={styles.filterText}>Nouvelles</Text>
          {selectedFilter === 'nouvelle' && <View style={styles.selectedIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedFilter('encours')}
        >
          <Text style={styles.filterText}>En cours</Text>
          {selectedFilter === 'encours' && <View style={styles.selectedIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedFilter('refusee')}
        >
          <Text style={styles.filterText}>Refusées</Text>
          {selectedFilter === 'refusee' && <View style={styles.selectedIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedFilter('livree')}
        >
          <Text style={styles.filterText}>Livrées</Text>
          {selectedFilter === 'livree' && <View style={styles.selectedIndicator} />}
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredCommandes}
        keyExtractor={(item) => item.id}
        renderItem={renderCommande}
        contentContainerStyle={styles.commandeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#343A40',
    marginBottom: 20,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingVertical: 10,
    alignItems: 'center',
    flex: 1,
  },
  selectedIndicator: {
    width: '100%',
    height: 3,
    backgroundColor: '#FF4B3A',
    marginTop: 5,
  },
  filterText: {
    color: '#343A40',
    fontWeight: 'bold',
  },
  commandeList: {
    paddingBottom: 20,
  },
  commandeCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  commandeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  commandeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
  },
  commandeDate: {
    fontSize: 14,
    color: '#868E96',
    textAlign: 'right',
  },
  commandeDetail: {
    fontSize: 16,
    marginBottom: 5,
    color: '#6C757D',
  },
  detailsButton: {
    color: '#FF4B3A', // Application's primary color
    marginTop: 10,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#28A745', // Green color
  },
  rejectButton: {
    backgroundColor: '#DC3545', // Red color
  },
  deliveredButton: {
    backgroundColor: '#17A2B8', // Blue color
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default DashboardFourScreen;