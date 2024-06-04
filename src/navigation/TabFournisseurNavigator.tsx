import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardFournisseurScreen from '../screens/DashboardFourScreen';
import MenuFournisseurScreen from '../screens/MenuFourScreen';
import PaiementFournisseurScreen from '../screens/PaiementFourScreen';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const TabFournisseurNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Tableau de Bord') {
            iconName = 'view-dashboard';
          } else if (route.name === 'Menu') {
            iconName = 'food';
          } else if (route.name === 'Paiement') {
            iconName = 'credit-card';
          }

          return (
            <Icon
              name={iconName}
              size={30}
              color={focused ? '#FF4B3A' : '#555'}
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          let label;

          if (route.name === 'Tableau de Bord') {
            label = 'Dashboard';
          } else if (route.name === 'Menu') {
            label = 'Menu';
          } else if (route.name === 'Paiement') {
            label = 'Paiement';
          }

          return <Text style={{ color: focused ? '#FF4B3A' : '#555' }}>{label}</Text>;
        }
      })}
      tabBarOptions={{
        activeTintColor: '#FF4B3A',
        inactiveTintColor: '#555',
      }}
    >
      <Tab.Screen name="Tableau de Bord" component={DashboardFournisseurScreen} />
      <Tab.Screen name="Menu" component={MenuFournisseurScreen} />
      <Tab.Screen name="Paiement" component={PaiementFournisseurScreen} />
    </Tab.Navigator>
  );
};

export default TabFournisseurNavigator;