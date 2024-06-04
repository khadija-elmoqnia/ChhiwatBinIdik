import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Platform, Text } from 'react-native';
import { updatePlat } from '../services/platservice';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const EditPlatScreen = () => {
  const route = useRoute();
  const { plat, onGoBack } = route.params;
  const [title, setTitle] = useState(plat.title);
  const [description, setDescription] = useState(plat.description);
  const [price, setPrice] = useState(plat.price);
  const [categoryId, setCategoryId] = useState(plat.categoryId);
  const [imageURL, setImageURL] = useState(plat.imageURL);
  const [imagePath, setImagePath] = useState('');
  const [documentId, setDocumentId] = useState(plat.document_id);
  const navigation = useNavigation();
  const [fournisseurId, setFournisseurId] = useState(null);

  useEffect(() => {
    const fetchFournisseurId = async () => {
      const id = await AsyncStorage.getItem('fournisseurId');
      setFournisseurId(id);
    };

    fetchFournisseurId();
  }, []);

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

  const handleUpdatePlat = async () => {
    try {
      if (fournisseurId) {
        const updatedPlat = { title, description, price, categoryId, imageURL, document_id: documentId, fournisseurId };
        await updatePlat(updatedPlat);
        onGoBack(); // Call the callback to refresh the list
        navigation.goBack();
      } else {
        console.error('Fournisseur ID non trouvé');
        Alert.alert('Erreur', 'ID du fournisseur non trouvé.');
      }
    } catch (error) {
      console.error('Error updating plat:', error);
      Alert.alert('Erreur', 'Erreur lors de la mise à jour du plat.');
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
      {imagePath ? <Image source={{ uri: imagePath }} style={styles.image} /> : <Image source={{ uri: imageURL }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={handleUpdatePlat}>
        <Text style={styles.buttonText}>Modifier Plat</Text>
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

export default EditPlatScreen;