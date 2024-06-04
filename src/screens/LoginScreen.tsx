import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Alert } from 'react-native';
import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'; // Importer auth depuis @react-native-firebase/auth
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import myImage2 from '../../assets/images/Logo3.png';
import myImage3 from '../../assets/images/google.png';
import eyeclosed from '../../assets/images/eyeclosed.png';
import eyeopen from '../../assets/images/eyeopen.png';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '869924086974-o47pk711o6qkddo40nem6p4q2h9skg3i.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut(); // Déconnexion de l'utilisateur actuel
      const { idToken, user } = await GoogleSignin.signIn();
      console.log(user);
      navigation.navigate('Welcome');
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
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

  const handleLogin = async () => {
     try {
       const userCredentials = await auth().signInWithEmailAndPassword(email, password);
       console.log('Utilisateur connecté avec succès:', userCredentials.user);

       // Vérifiez le rôle de l'utilisateur
       const userRef = database().ref(`/users/${userCredentials.user.uid}`);
       userRef.once('value')
         .then(snapshot => {
           if (snapshot.exists()) {
             const userData = snapshot.val();
             // Naviguer en fonction du rôle de l'utilisateur
             if (userData.role === 'fournisseur') {
               navigation.navigate('DashFournisseur');
             } else {
               navigation.navigate('Welcome');
             }
           } else {
             Alert.alert("Erreur", "Utilisateur non trouvé.");
           }
         });
     } catch (error) {
       console.error('Erreur de connexion:', error);
       Alert.alert('Erreur de connexion', error.message);
     }
   };

  const handleRegister = () => {
    navigation.navigate('SignIn');
  };

const handleForgotPassword = async () => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    Alert.alert("Succès", "Email de réinitialisation du mot de passe envoyé avec succès.");
  } catch (error) {
    Alert.alert("Erreur", error.message);
  }
};

const [showPassword, setShowPassword] = useState(false);


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={myImage2}
          style={styles.logo}
        />
        <Text style={styles.title}>Se connecter</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          value={password}
        />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? eyeopen : eyeclosed}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Mot de passe oublié?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.register}>
            Première visite? <Text style={styles.boldText}>Inscrivez-vous</Text>
          </Text>
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
  eyeIcon:{
  width:20,
  height:20,
  marginTop:-56,
  marginLeft:320,

  },
  title: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    marginTop: -40,
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
  },
  logo: {
    marginLeft: 20,
    marginTop: -60,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  button1: {
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
  forgotPassword: {
    color: '#FF4B3A',
    fontFamily: 'Raleway-Bold',
    textDecorationLine: 'underline',
    marginBottom: 15,
    marginTop: -5,
    marginLeft: 206,
  },
  register: {
    fontSize: 18,
    marginLeft: 45,
    marginTop: 15,
  },
  boldText: {
    fontFamily: 'Raleway-Bold',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 60,
    marginBottom: 20,
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
});

export default LoginScreen;