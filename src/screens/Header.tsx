import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MyText from '../components/MyText';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/panier.png';

const Header = ({ navigateToDashboard, navigateToCart }) => {
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToDashboard}>
          <Image source={DashboardIcon} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.space}></View>
        <TouchableOpacity onPress={navigateToCart}>
          <Image source={CartIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View>
        <MyText style={styles.headerText}>Plat fait maison...{'\n'}Relevé d'une touche marocaine</MyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  space: {
    marginLeft: 290,
  },
  headerText: {
    flex: 1,
    marginLeft: 21,
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
    fontFamily: 'Raleway-Bold',
  },
});

export default Header;