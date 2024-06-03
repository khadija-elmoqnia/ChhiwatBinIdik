import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import database from '@react-native-firebase/database';
import CheckBox from '@react-native-community/checkbox';

import myImage2 from '../../assets/images/Logo3.png';
import myImage3 from '../../assets/images/google.png';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFournisseur, setIsFournisseur] = useState(false);
  const [cinNumber, setCinNumber] = useState('');
  const [completeAddress, setCompleteAddress] = useState('');
  const [fullName, setFullName] = useState(''); // Add state for full name

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '869924086974-o47pk711o6qkddo40nem6p4q2h9skg3i.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      const { idToken, user } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const signInResult = await auth().signInWithCredential(googleCredential);

      // Check if user exists in the database
      const userRef = database().ref(`/users/${signInResult.user.uid}`);
      userRef.once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            // Navigate based on user role
            if (userData.role === 'fournisseur') {
              navigation.navigate('HomeScreenFournisseur');
            } else {
              navigation.navigate('Home');
            }
          } else {
            // User does not exist, navigate to form screen
            navigation.navigate('SignUpForm', { user: signInResult.user });
          }
        });
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('La connexion a été annulée.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('La connexion est en cours...');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Les services Google Play ne sont pas disponibles ou obsolètes.');
      } else {
        Alert.alert('Erreur de connexion avec Google. Veuillez réessayer plus tard.');
      }
    }
  }

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredentials.user.uid;
      console.log('Utilisateur inscrit avec succès:', userCredentials.user);

      // Save user data to Firebase Realtime Database
      const userData = {
        email: email,
        phoneNumber: phoneNumber,
        fullName: fullName, // Include full name in the user data
        role: isFournisseur ? 'fournisseur' : 'client',
      };

      if (isFournisseur) {
        userData.cinNumber = cinNumber;
        userData.completeAddress = completeAddress;
      }

      await database().ref(`/users/${userId}`).set(userData);

      // Navigate based on user role
      if (isFournisseur) {
        navigation.navigate('HomeScreenFournisseur');
      } else {
        navigation.navigate('Welcome');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      Alert.alert('Erreur d\'inscription', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={myImage2} style={styles.logo} />
        <Text style={styles.title}>S'inscrire</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          onChangeText={setFullName}
          placeholderTextColor="gray"
          value={fullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="gray"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={true}
          placeholderTextColor="gray"
          onChangeText={setPassword}
          value={password}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          placeholderTextColor="gray"
          value={confirmPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
          placeholderTextColor="gray"
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
              onChangeText={setCinNumber}
              placeholderTextColor="gray"
              value={cinNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse complète"
              onChangeText={setCompleteAddress}
              placeholderTextColor="gray"
              value={completeAddress}
            />
          </>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
        <View style={styles.lineContainer}>
          <View style={styles.line}></View>
          <Text style={styles.continueWith}>Ou continuez avec</Text>
          <View style={styles.line}></View>
        </View>
        <TouchableOpacity style={styles.buttongoogle} onPress={onGoogleButtonPress}>
          <Image source={myImage3} style={styles.buttonIcon} />
          <Text style={styles.buttonTextg}>Google</Text>
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
  title: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    marginTop: -60,
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
  logo: {
    marginLeft: 20,
    marginTop: -60,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FF4B3A',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttongoogle: {
    backgroundColor: '#FF4B3A',
    flexDirection: 'row',
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
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 100,
    marginLeft: -120,
  },
  buttonTextg: {
    fontFamily: 'Raleway-Bold',
    fontSize: 19,
    color: 'black',
    textAlign: 'center',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    borderBottomWidth: 0.70,
    borderBottomColor: 'grey',
    marginBottom: 10,
  },
  continueWith: {
    marginHorizontal: 20,
    color: 'grey',
    marginTop: -10,
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
    color:'black',
  },
});

export default SignInScreen;