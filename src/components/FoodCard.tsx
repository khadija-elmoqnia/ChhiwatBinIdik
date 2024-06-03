import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import MyText from './MyText';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function FoodCard({ image, title, price, itemKey, onDelete, onUpdate }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('FoodDetail', { itemKey });
    };

    const deletePlat = () => {
        onDelete(itemKey);
    };

    const updatePlat = () => {
        onUpdate(itemKey);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} style={styles.touchable}>
                <Image style={styles.image} source={{ uri: image }} />
                <View style={styles.textContainer}>
                    <MyText numberOfLines={1} style={styles.title}>
                        {title}
                    </MyText>
                    <MyText style={styles.price}>{price} dh</MyText>
                </View>
            </TouchableOpacity>
            {/* Boutons de mise à jour et de suppression */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={updatePlat} style={styles.updateButton}>
                    <MyText style={styles.updateButtonText}>Mettre à jour</MyText>
                </TouchableOpacity>
                <TouchableOpacity onPress={deletePlat} style={styles.deleteButton}>
                    <MyText style={styles.deleteButtonText}>Supprimer</MyText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FF4B3A',
        marginHorizontal: 22,
        marginTop: 14,
        height: 220,
        width: 350,
    },
    touchable: {
        height: '85%',
    },
    image: {
        width: '100%',
        height: '80%',
        resizeMode: 'cover',
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center',
        height: '20%',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Raleway-Bold',
        color: 'white',
    },
    price: {
        color: 'white',
        fontSize: 23,
        marginVertical: 1.5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    updateButton: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FoodCard;
