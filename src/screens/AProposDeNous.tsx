// AboutUsScreen.js

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const AProposDeNous = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>À Propos de Nous</Text>
        <Text style={styles.paragraph}>
          Chez CHEHIWAT BIN IDIK, nous croyons que la bonne cuisine est un art qui devrait être partagé avec le monde. Notre plateforme rassemble des chefs passionnés, des cuisiniers amateurs talentueux et des amoureux de la cuisine maison pour créer une communauté vibrante et diversifiée.
        </Text>
        <Text style={styles.paragraph}>
          Notre mission est de mettre en valeur les talents culinaires de chacun, en offrant aux chefs amateurs une vitrine pour présenter leurs créations uniques et en permettant aux amateurs de découvrir et de savourer une variété de plats faits maison, préparés avec amour et savoir-faire.
        </Text>
        <Text style={styles.paragraph}>
          Que vous soyez un chef passionné qui souhaite partager ses recettes traditionnelles familiales ou un cuisinier amateur enthousiaste à l'idée de proposer ses propres créations culinaires, notre plateforme vous offre une opportunité de vous connecter avec une communauté de personnes partageant les mêmes idées et de faire briller vos talents.
        </Text>
        <Text style={styles.paragraph}>
          Nous sommes fiers de soutenir et de promouvoir la diversité culinaire, en offrant une variété de plats authentiques provenant de différentes cultures et traditions culinaires à travers le monde. Chaque plat est une histoire à savourer, racontée avec des saveurs uniques et des ingrédients soigneusement sélectionnés.
        </Text>
        <Text style={styles.paragraph}>
          Merci de faire partie de notre communauté. Ensemble, nous célébrons la passion pour la cuisine maison et l'art de bien manger.
        </Text>
        <Text style={styles.signature}>L'équipe de CHEHIWAT BIN IDIK</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  signature: {
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default AProposDeNous;