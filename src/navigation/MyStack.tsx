// MyStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CartScreen from '../screens/CartScreen';
import TabNavigator from './TabNavigator';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreenFournisseur from '../screens/HomeScreenFournisseur';
import AddPlat from '../screens/AddPlat';
import ModifierPlatScreen from'../screens/ModifierPlatScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import Commandes from '../screens/Commandes';
import AProposDeNous from '../screens/AProposDeNous';
import Politiques from '../screens/Politiques';
import OffresEtPromos from '../screens/OffresEtPromos';
import SearchResultsPage from '../screens/SearchResultsPage';
import notificationScreen from '../screens/notificationScreen';
import { StripeProvider } from "@stripe/stripe-react-native";
import PaymentScreen from '../screens/PaymentScreen';
import FournisseurScreen from '../screens/FournisseurScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import SignUpForm from '../screens/SignUpForm';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function MyStack() {
  return (
     <StripeProvider publishableKey="pk_test_51PKTcHP0hvs8yyIS79G4VK0uXRxrv4lIgujVp6rax7QBmrQTzp6yZUvYDPoXJuCyPzc9bPAGWzVip0NouqbI7w5l003oubzxPU">
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignIn" component={SignUpScreen} />
        <Stack.Screen name="Welcome" component={TabNavigator} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="cart" component={CartScreen} />
        <Stack.Screen name="HomeScreenFournisseur" component={HomeScreenFournisseur} />
        <Stack.Screen name="AddPlat" component={AddPlat} />
        <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
        <Stack.Screen name="ModifierPlat" component={ModifierPlatScreen} />
        <Stack.Screen name="Commandes" component={Commandes} />
        <Stack.Screen name="AProposDeNous" component={AProposDeNous} />
        <Stack.Screen name="Politiques" component={Politiques} />
        <Stack.Screen name="OffresEtPromos" component={OffresEtPromos} />
        <Stack.Screen name="SearchResultsPage" component={SearchResultsPage} />
        <Stack.Screen name="notification" component={notificationScreen} />
        <Stack.Screen name="pay" component={PaymentScreen} />
        <Stack.Screen name="Fournisseur" component={FournisseurScreen} />
        <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} />
         <Stack.Screen name="SignUpForm" component={SignUpForm} />



      </Stack.Navigator>
    </StripeProvider>
  );
}