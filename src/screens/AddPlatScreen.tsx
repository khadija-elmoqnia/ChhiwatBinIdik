import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Platform, Text } from 'react-native';
import { createPlat } from '../services/platservice';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const AddPlatScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [imagePath, setImagePath] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { onGoBack } = route.params;

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0];
        setImagePath(source.uri);
        uploadImageToFirebase(source.uri);
      }
    });
  };

  const uploadImageToFirebase = async (uri) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const task = storage().ref(`images/${filename}`).putFile(uploadUri);

    task.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    });

    try {
      await task;
      const url = await storage().ref(`images/${filename}`).getDownloadURL();
      setImageURL(url);
      console.log('Image URL: ', url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePlat = async () => {
    if (!imageURL) {
      Alert.alert('Erreur', 'Veuillez d\'abord télécharger une image.');
      return;
    }

    try {
      const fournisseurId = await AsyncStorage.getItem('fournisseurId');
      if (fournisseurId) {
        const newPlat = {
          title,
          description,
          price,
          categoryId,
          imageURL,
          document_id: Math.random().toString(36).substring(7),
          fournisseurId,
        };
        await createPlat(newPlat);
        onGoBack(); // Call the callback to refresh the list
        navigation.goBack();
      } else {
        console.error('Fournisseur ID non trouvé');
        Alert.alert('Erreur', 'ID du fournisseur non trouvé.');
      }
    } catch (error) {
      console.error('Error creating plat:', error);
      Alert.alert('Erreur', 'Erreur lors de la création du plat.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Category ID" value={categoryId} onChangeText={setCategoryId} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      {imagePath ? <Image source={{ uri: imagePath }} style={styles.image} /> : null}
      <TouchableOpacity style={styles.button} onPress={handleCreatePlat}>
        <Text style={styles.buttonText}>Ajouter Plat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FF4B3A',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 8,
  },
});

export default AddPlatScreen;