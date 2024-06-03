import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

const PaymentSuccessScreen = ({ navigation }) => {
  const handleReturnToOrders = () => {
    navigation.navigate('Commandes');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Paiement réussi !</Text>
      <Text style={styles.subText}>Merci pour votre achat. Vous pouvez suivre votre commande.</Text>
      <TouchableOpacity style={styles.button} onPress={handleReturnToOrders}>
        <Text style={styles.buttonText}>Suivre votre commande</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4B3A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF4B3A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentSuccessScreen;
