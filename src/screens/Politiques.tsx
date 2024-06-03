// PrivacyPolicyScreen.js

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';

const Politiques = () => {
  const contactEmail = 'chehiwatbinidikapp@gmail.com'; // Your contact email address

  const handleEmailLink = () => {
    Linking.openURL(`mailto:${contactEmail}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Politique de confidentialité</Text>
        <Text style={styles.paragraph}>
          Chez CHEHIWAT BIN IDIK, nous nous engageons à protéger la confidentialité de nos utilisateurs. Cette politique de confidentialité explique comment nous recueillons, utilisons et protégeons les informations que vous nous fournissez lorsque vous utilisez notre application mobile de service de vente de plats faits maison.
        </Text>
        <Text style={styles.paragraph}>
          Les informations personnelles que nous collectons peuvent inclure votre nom, votre adresse e-mail, votre adresse postale et votre numéro de téléphone. Nous utilisons ces informations pour traiter vos commandes, vous contacter concernant votre compte et vous fournir un meilleur service.
        </Text>
        <Text style={styles.paragraph}>
          Nous ne partagerons pas vos informations personnelles avec des tiers sans votre consentement, sauf si cela est nécessaire pour fournir le service que vous avez demandé, par exemple pour livrer votre commande.
        </Text>
        <Text style={styles.paragraph}>
          Nous prenons des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès non autorisé, altération, divulgation ou destruction.
        </Text>
        <Text style={styles.paragraph}>
          En utilisant notre application, vous consentez à notre politique de confidentialité et acceptez de nous fournir vos informations personnelles dans le but décrit ci-dessus.
        </Text>
        <Text style={styles.paragraph}>
          Pour toute question ou préoccupation concernant notre politique de confidentialité, veuillez nous contacter à{' '}
          <Text style={styles.emailLink} onPress={handleEmailLink}>{contactEmail}</Text>.
        </Text>
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
    marginBottom: 25,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  emailLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default Politiques;