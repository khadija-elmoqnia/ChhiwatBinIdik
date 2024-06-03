import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { Picker } from '@react-native-picker/picker';
function AddPlat() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesList = [];
                const querySnapshot = await firestore().collection('categories').get();
                querySnapshot.forEach(documentSnapshot => {
                    const data = documentSnapshot.data();
                    if (data && data.title) {
                        categoriesList.push({
                            label: data.title,
                            value: documentSnapshot.id,
                        });
                    } else {
                        console.error('Document data or title field is undefined:', documentSnapshot.id);
                    }
                });
                setCategories(categoriesList);
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!title || !description || !price || !categoryId || !imageURL) {
            Alert.alert('Erreur', 'Tous les champs sont requis.');
            return;
        }

        try {
            const currentUser = auth().currentUser;

            if (currentUser) {
                const fournisseurId = currentUser.uid;
                const fournisseurSnapshot = await database().ref(`users/${fournisseurId}`).once('value');
                const fournisseurData = fournisseurSnapshot.val();

                if (!fournisseurData) {
                    Alert.alert('Erreur', 'Impossible de récupérer les informations du fournisseur');
                    return;
                }

                const fournisseurName = fournisseurData.fullName || 'Unknown';
                console.log('fournisseurName:', fournisseurName);

                const platData = {
                    title: title,
                    description: description,
                    price: price,
                    categoryId: categoryId,
                    fournisseurId: fournisseurId,
                    fournisseurName: fournisseurName,
                    imageURL: imageURL, // Ensure imageURL is included
                };

                const response = await axios.post('http://172.20.192.1:8080/plats/create', platData);

                if (response.status === 200) {
                    console.log('Plat ajouté avec succès');
                    Alert.alert('Succès', 'Le plat a été ajouté avec succès.');
                    setTitle('');
                    setDescription('');
                    setPrice('');
                    setImageURL('');
                    setCategoryId(null);
                } else {
                    console.error('Erreur lors de l\'ajout du plat');
                    Alert.alert('Erreur', 'Erreur lors de l\'ajout du plat');
                }
            } else {
                Alert.alert('Erreur', 'Utilisateur non connecté');
            }
        } catch (error) {
            console.error('Erreur lors de la requête vers le backend:', error);
            Alert.alert('Erreur', 'Erreur lors de la requête vers le backend');
        }
    };

    const handleSelectImage = async () => {
        try {
            const options = {
                mediaType: 'photo',
                quality: 1,
            };
            launchImageLibrary(options, async (response) => {
                if (response.didCancel) {
                    console.log('Sélection d\'image annulée');
                } else if (response.errorMessage) {
                    console.error('Erreur lors de la sélection de l\'image: ', response.errorMessage);
                } else {
                    const uri = response.assets[0].uri;
                    setImageURL(uri);
                    await uploadImageToFirebaseStorage(uri);
                }
            });
        } catch (error) {
            console.error('Erreur lors de la sélection de l\'image: ', error);
        }
    };

    const uploadImageToFirebaseStorage = async (filePath) => {
        try {
            const reference = storage().ref().child('images/' + new Date().getTime() + '.jpg');
            await reference.putFile(filePath);
            const downloadURL = await reference.getDownloadURL();
            setImageURL(downloadURL);
            console.log('Image téléchargée avec succès');
        } catch (error) {
            console.error('Erreur lors du téléchargement de l\'image sur Firebase Storage:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nom du plat"
                placeholderTextColor="gray"
                onChangeText={text => setTitle(text)}
                value={title}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="gray"
                onChangeText={text => setDescription(text)}
                value={description}
            />
            <TextInput
                style={styles.input}
                placeholder="Prix"
                placeholderTextColor="gray"
                onChangeText={text => setPrice(text)}
                value={price}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="URL de l'image"
                placeholderTextColor="gray"
                value={imageURL}
                editable={false}
            />
            <DropDownPicker
                open={open}
                value={categoryId}
                items={categories}
                setOpen={setOpen}
                setValue={setCategoryId}
                setItems={setCategories}
                placeholder="Sélectionner une catégorie"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
            />

            <TouchableOpacity onPress={handleSelectImage}>
                <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>Sélectionner une image</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit}>
                <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: 'black',
    },
    dropdown: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
    dropdownContainer: {
        borderColor: 'gray',
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddPlat;
