import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, Text, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { amount, items, userId } = route.params;

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const createPaymentIntent = functions().httpsCallable('createPaymentIntent');
      const paymentIntentData = await createPaymentIntent({
        amount: amount * 100,
        currency: 'usd',
        items,
        userId,
      });

      const clientSecret = paymentIntentData?.data?.paymentIntent;
      if (clientSecret) {
        setClientSecret(clientSecret);
      } else {
        throw new Error('Client secret is missing in the response');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      console.log('Please select a payment method.');
      return;
    }

    if (paymentMethod === 'delivery' && !address) {
      console.log('Please enter an address for delivery.');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'card') {
        if (!cardDetails?.complete) {
          console.log('Please enter complete card details.');
          setLoading(false);
          return;
        }

        if (!clientSecret) {
          throw new Error('Client secret is empty');
        }

        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: 'Card',
        });

        if (error) {
          console.log('Payment failed:', error.message);
          setLoading(false);
          return;
        } else {
          console.log('Payment successful:', paymentIntent);
        }
      } else if (paymentMethod === 'delivery') {
        await handlePaymentOnDelivery();
      }

      const orderId = await createOrder(items, userId, amount, address);
      if (!orderId) {
        throw new Error('Erreur lors de la création de la commande');
      }

      await firestore().collection('commandes').doc(orderId).update({
        statusFournisseur: 'Nouvelle',
        address,
      });

      setLoading(false);
      navigation.navigate('PaymentSuccessScreen');
    } catch (error) {
      console.error('Error during payment:', error);
      setLoading(false);
    }
  };

  const handlePaymentOnDelivery = async () => {
    // Handle payment on delivery logic
  };

  const createOrder = async (items, userId, totalPrice, address) => {
    try {
      const orderDetails = {
        userId,
        items: items.map(item => ({
          ...item,
          fournisseurId: item.fournisseurId || 'unknown',
          imageURL: item.imageURL || 'unknown',
          averageRating: item.averageRating || 0,
        })),
        totalPrice,
        createdAt: firestore.FieldValue.serverTimestamp(),
        address,
      };

      const orderRef = await firestore().collection('commandes').add(orderDetails);
      return orderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paiement</Text>
      <TextInput
        style={styles.input}
        placeholder="Adresse de livraison"
        onChangeText={setAddress}
        value={address}
      />
      <TouchableOpacity
        style={[styles.button, paymentMethod === 'delivery' && styles.buttonActive]}
        onPress={() => setPaymentMethod('delivery')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Payer à la livraison</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, paymentMethod === 'card' && styles.buttonActive]}
        onPress={() => setPaymentMethod('card')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Payer par carte</Text>
      </TouchableOpacity>
      {paymentMethod === 'card' && (
        <>
          <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={styles.cardField}
            onCardChange={setCardDetails}
          />
          <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </>
      )}
      {loading && <ActivityIndicator size="large" color="#ff6347" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ff6347',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonActive: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardField: {
    height: 50,
    marginVertical: 20,
  },
});

export default PaymentScreen;