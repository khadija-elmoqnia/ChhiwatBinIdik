import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import backIcon2 from './../../assets/images/backk.png';
import auth from '@react-native-firebase/auth';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // Default payment method is empty
  const [address, setAddress] = useState(''); // State to store the address
  const [deliveryMethod, setDeliveryMethod] = useState(''); // State to store the delivery method
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
    try {
      setLoading(true);

      if (paymentMethod === 'card') {
        if (!cardDetails?.complete) {
          console.log('Please enter complete card details.');
          setLoading(false);
          return;
        }

        console.log('Client Secret:', clientSecret);
        if (!clientSecret) {
          throw new Error('Client secret is empty');
        }

        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: 'Card',
        });

        if (error) {
          console.log('Payment failed:', error.message);
        } else {
          console.log('Payment successful:', paymentIntent);
        }
      } else if (paymentMethod === 'delivery') {
        await handlePaymentOnDelivery(); // Call function for payment on delivery
      }

      const orderId = await createOrder(items, userId, amount, address, deliveryMethod); // Pass the address and delivery method to createOrder
      if (!orderId) {
        throw new Error('Erreur lors de la création de la commande');
      }

      await firestore().collection('commandes').doc(orderId).update({
        statusClient: 'En cours de traitement',
        statusFournisseur: 'Nouvelle commande ',
        address, // Save the address in the order document
        deliveryMethod, // Save the delivery method in the order document
      });

      navigation.navigate('PaymentSuccessScreen');
    } catch (error) {
      console.error('Error during payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentOnDelivery = async () => {
    try {
      setLoading(true);

      // Handle payment on delivery logic
      // For example, you can update the order status or any other relevant action
    } catch (error) {
      console.error('Error during payment on delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (items, userId, totalPrice, address, deliveryMethod) => {
    try {
      const orderDetails = {
        userId,
        items: items.map(item => ({
          ...item,
          fournisseurId: item.fournisseurId || 'unknown',
          imageURL: item.imageURL || 'unknown', // Include imageURL here
          averageRating: item.averageRating || 0, // Include averageRating here
        })),
        totalPrice,
        createdAt: firestore.FieldValue.serverTimestamp(),
        address,
        deliveryMethod,
      };

      const orderRef = await firestore().collection('commandes').add(orderDetails);
      return orderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backIcon2} style={styles.backIcon} />
        </TouchableOpacity>
        <View>
          <Text style={styles.header1}>Paiement</Text>
        </View>
        <Text style={styles.title}>Méthode de livraison</Text>
        <TouchableOpacity
          style={[styles.deliveryOption, deliveryMethod === 'home' && styles.selectedOption]}
          onPress={() => setDeliveryMethod('home')}
          disabled={loading}
        >
          <Image source={require('./../../assets/images/homee.png')} style={styles.icon} />
          <Text style={styles.optionText}>Livraison à domicile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deliveryOption, deliveryMethod === 'pickup' && styles.selectedOption]}
          onPress={() => setDeliveryMethod('pickup')}
          disabled={loading}
        >
          <Image source={require('./../../assets/images/pickup.png')} style={styles.icon} />
          <Text style={styles.optionText}>Retrait en point relais</Text>
        </TouchableOpacity>
        {deliveryMethod && (
          <>
            <Text style={styles.title}>Méthode de paiment</Text>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'delivery' && styles.selectedOption]}
              onPress={() => setPaymentMethod('delivery')}
              disabled={loading}
            >
              <Image source={require('./../../assets/images/cash.png')} style={styles.icon} />
              <Text style={styles.optionText}>Paiment à la livraison</Text>
            </TouchableOpacity>
            {paymentMethod === 'delivery' && (
              <TextInput
                style={styles.input}
                placeholder="Adresse de livraison"
                onChangeText={setAddress}
                value={address}
              />
            )}
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedOption]}
              onPress={() => setPaymentMethod('card')}
              disabled={loading}
            >
              <Image source={require('./../../assets/images/creditcard.png')} style={styles.icon} />
              <Text style={styles.optionText}>Paiment par carte</Text>
            </TouchableOpacity>
            {paymentMethod === 'card' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Adresse de livraison"
                  onChangeText={setAddress}
                  value={address}
                />
                <Text style={styles.title}>Informations sur la carte</Text>
                <CardField
                  postalCodeEnabled={false}
                  placeholder={{
                    number: '4242 4242 4242 4242',
                  }}
                  cardStyle={{
                    backgroundColor: 'white',
                    textColor: 'black',
                  }}
                  style={styles.cardField}
                  onCardChange={setCardDetails}
                />
              </>
            )}
          </>
        )}
        <TouchableOpacity
          style={[styles.button, (loading || !paymentMethod || !deliveryMethod) && styles.disabledButton]}
          onPress={handlePayment}
          disabled={loading || !paymentMethod || !deliveryMethod}
        >
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
        {loading && <Text>Loading...</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: 'black',
    marginBottom: 20,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: '#FF4B3A',
    backgroundColor: '#f2e0d3',
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  cardField: {
    height: 50,
    marginVertical: 20,
    marginTop: -5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#FF4B3A',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  disabledButton: {
    backgroundColor: '#FF4B3A80', // Slightly transparent when disabled
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  header1: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: 'black',
    marginBottom: 20,
    marginTop: 0,
    textAlign: 'center',
  },
});

export default PaymentScreen;
