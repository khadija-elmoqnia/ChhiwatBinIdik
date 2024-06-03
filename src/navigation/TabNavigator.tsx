import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ContactScreen from '../screens/ContactScreen';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/panier.png';
import FavoriteIcon from './../../assets/images/favorie.png';
import ContactIcon from './../../assets/images/contact.png';
import HomeIcon from './../../assets/images/home.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        const userFavoritesRef = firestore().collection(`users/${user.uid}/favorites`);
        const listener = userFavoritesRef.onSnapshot((snapshot) => {
          const count = snapshot.size;
          setFavoriteCount(count);
        });
        return () => listener();
      } else {
        setFavoriteCount(0);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#E0E0E0',
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={HomeIcon}
              style={[styles.icon, { tintColor: focused ? '#FF4B3A' : color }]}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="favorite"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.favoriteIconContainer}>
              <Image
                source={FavoriteIcon}
                style={[styles.icon, { tintColor: focused ? '#FF4B3A' : color }]}
              />
              {favoriteCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{favoriteCount}</Text>
                </View>
              )}
            </View>
          ),
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('favorite');
          },
        })}
      />
      <Tab.Screen
        name="contact"
        component={ContactScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={ContactIcon}
              style={[styles.icon, { tintColor: focused ? '#FF4B3A' : color }]}
            />
          ),
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('contact');
          },
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
  },
  favoriteIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 5,
    right: -5,
    backgroundColor: '#FF4B3A',
    borderRadius: 10,
    minWidth: 20,
    minHeight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TabNavigator;