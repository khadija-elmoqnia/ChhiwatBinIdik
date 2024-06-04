import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import back from './../../assets/images/back.png';
import commandesIcon from './../../assets/images/commandes.png';

import politiquesIcon from './../../assets/images/politiques.png';
import aproposIcon from './../../assets/images/apropos.png';
import deconIcon from './../../assets/images/decon.png';
import conIcon from './../../assets/images/conn.png';

const DashboardScreen = ({ onClose, navigation }) => {
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        const userRef = database().ref(`/users/${user.uid}`);
        userRef.on('value', snapshot => {
          const userData = snapshot.val();
          if (userData && userData.fullName) {
            setUsername(userData.fullName);
          }
        });
        return () => userRef.off('value'); // Cleanup the listener on unmount
      } else {
        setCurrentUser(null);
        setUsername('');
      }
    });
    return unsubscribe;
  }, []);

  const handleNavigation = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Main');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleLogin = () => {
    onClose();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Image source={back} style={styles.icon} />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Bienvenue</Text>
        <View style={styles.name}>
          {username && <Text style={styles.usernameText}>{username}!</Text>}
        </View>
      </View>
      <View style={styles.menuItemContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('Commandes')}>
          <Image source={commandesIcon} style={styles.menuIconComman} />
          <Text style={styles.menuText}>Commandes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('Politiques')}>
          <Image source={politiquesIcon} style={styles.menuIcon} />
          <Text style={styles.menuText}>Politiques</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('AProposDeNous')}>
          <Image source={aproposIcon} style={styles.menuIcon} />
          <Text style={styles.menuText}>À propos de nous</Text>
        </TouchableOpacity>
        {currentUser ? (
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Image source={deconIcon} style={styles.menuIcon} />
            <Text style={styles.menuText}>Déconnexion</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.menuItem} onPress={handleLogin}>
            <Image source={conIcon} style={styles.menuIcon} />
            <Text style={styles.menuText}>Connexion</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  menuItemContainer: {
    marginTop: 130,
  },
  icon: {
    height: 30,
    width: 30,
    marginLeft: 210,
    marginTop: -20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: -21,
  },
  name: {
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 24,
    marginLeft: -160,
  },
  usernameText: {
    fontSize: 18,
    marginTop: 5,
    color: '#FF4B3A',
    fontFamily: 'Raleway-Bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  menuIconComman: {
    width: 40,
    height: 40,
    marginRight: 6,
  },
  menuText: {
    fontSize: 18,
  },
});

export default DashboardScreen;