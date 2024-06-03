import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Fournisseur = ({ title, itemKey, isSelected, onSelect }) => {
    return (
        <TouchableOpacity
            style={[styles.container, isSelected ? styles.selected : null]}
            onPress={() => onSelect(itemKey)}
        >
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        marginRight: 10,
    },
    selected: {
        backgroundColor: '#FF4B3A',
    },
    title: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: '#000',
    },
});

export default Fournisseur;
