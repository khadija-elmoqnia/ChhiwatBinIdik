import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const PlatRow = ({ plat, onDelete, onUpdate }) => {
    return (
        <View style={styles.row}>
            <Image source={{ uri: plat.imageURL }} style={styles.image} />
            <Text style={styles.title}>{plat.title}</Text>
            <Text style={styles.price}>{plat.price} €</Text>
            <TouchableOpacity onPress={() => onUpdate(plat.key)} style={styles.button}>
                <Text style={styles.buttonText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(plat.key)} style={styles.button}>
                <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    title: {
        flex: 1,
        fontSize: 16,
        color: '#000', // texte noir
    },
    price: {
        width: 60,
        textAlign: 'right',
        fontSize: 16,
        color: '#000', // texte noir
    },
    button: {
        backgroundColor: '#FF4B3A',
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default PlatRow;
