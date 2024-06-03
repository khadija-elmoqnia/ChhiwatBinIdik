import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Commandes = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        const userOrders = await firestore()
          .collection('commandes')
          .where('userId', '==', user.uid)
          .get();

        const ordersData = userOrders.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B3A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>Aucune commande trouvée.</Text>
      ) : (
        <View>
          {orders.map(order => (
            <View key={order.id} style={styles.orderContainer}>
              <Text style={styles.orderStatus}>Statut: {order.statusClient}</Text>
              <Text style={styles.orderText}>Plats commandés :</Text>
              <View style={styles.itemsContainer}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemText}>Quantité: {item.quantity}</Text>
                    <Text style={styles.itemText}>Prix: {item.price} dh</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  orderContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  orderStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4B3A',
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  itemsContainer: {
    marginLeft: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  itemText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Commandes;
