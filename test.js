import React, { useState } from 'react';
import { View, ScrollView, Image, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import myImage2 from './assets/images/Logo3.png';
import myImage3 from './assets/images/google.png';
import { useNavigation } from '@react-navigation/native'; // Ajout de la navigation

const LoginScreen = () => {
  const navigation = useNavigation(); // Initialisation de la navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    // Ajoutez votre logique de connexion ici
  };

  const handleLoginGoogle = () => {
    // Ajoutez votre logique de connexion avec Google ici
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

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
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
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
        <TouchableOpacity style={styles.buttongoogle} onPress={handleLoginGoogle}>
          <Image  source={myImage3} style={styles.buttonIcon} />
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
    backgroundColor:'#DFDEDA',
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
    backgroundColor:'#EFEFEE',
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
    marginLeft:206,
  },
  register:{
    fontSize: 18,
    marginLeft: 45,
    marginTop:15,
  },
  boldText: {
    fontFamily: 'Raleway-Bold',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 60,
    marginBottom:20,
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
    marginTop:-10,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 100,
    marginLeft:-120,
  },
  buttonTextg: {
    fontFamily: 'Raleway-Bold',
    fontSize: 19,
    color: 'black',
    textAlign: 'center',
  },
});

export default LoginScreen;
