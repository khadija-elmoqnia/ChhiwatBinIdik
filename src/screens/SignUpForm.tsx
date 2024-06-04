import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const SignUpForm = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFournisseur, setIsFournisseur] = useState(false);
  const [cinNumber, setCinNumber] = useState('');
  const [completeAddress, setCompleteAddress] = useState('');

  const handleSignUpFormSubmit = async () => {
    try {
      const userId = user.uid;

      // Save user data to Firebase Realtime Database
      const userData = {
        email: user.email,
        fullName,
        phoneNumber,
        role: isFournisseur ? 'fournisseur' : 'client',
      };

      if (isFournisseur) {
        userData.cinNumber = cinNumber;
        userData.completeAddress = completeAddress;
      }

      await database().ref(`/users/${userId}`).set(userData);

      // Navigate based on user role
      if (isFournisseur) {
        navigation.navigate('DashFournisseur');
      } else {
        navigation.navigate('Welcome');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la soumission du formulaire.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Complétez votre profil</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          onChangeText={setFullName}
          placeholderTextColor="gray"
          value={fullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Numéro de téléphone"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isFournisseur}
            onValueChange={setIsFournisseur}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Je suis un fournisseur</Text>
        </View>
        {isFournisseur && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Numéro de la CIN"
              placeholderTextColor="gray"
              onChangeText={setCinNumber}
              value={cinNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse complète"
              placeholderTextColor="gray"
              onChangeText={setCompleteAddress}
              value={completeAddress}
            />
          </>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSignUpFormSubmit}>
          <Text style={styles.buttonText}>Soumettre</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#DFDEDA',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    marginBottom: 20,
    color: '#FF4B3A',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#EFEFEE',
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    fontFamily: 'Raleway-Medium',
    color:'black',
  },
  button: {
    backgroundColor: '#FF4B3A',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Raleway-Bold',
    fontSize: 19,
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
    fontFamily: 'Raleway-Medium',
    color:'gray',
  },
});

export default SignUpForm;