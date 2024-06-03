import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import MyText from './MyText';
import { useNavigation } from '@react-navigation/native';
import AverageRating from './AverageRating';

function FoodCardClient({ image, title, price, fournisseur, fournisseurId, itemKey }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('FoodDetail', { itemKey });
    };

    const handleFournisseurPress = () => {
        console.log('fournisseurId:', fournisseurId); // Debug log
        console.log('fournisseurName:', fournisseur); // Debug log
        navigation.navigate('Fournisseur', { fournisseurId, fournisseurName: fournisseur });
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <Image style={styles.image} source={{ uri: image }} />
            <View style={styles.textContainer}>
                <View style={styles.leftTextContainer}>
                    <MyText numberOfLines={1} style={styles.title}>
                        {title}
                    </MyText>
                    <TouchableOpacity onPress={handleFournisseurPress}>
                        <MyText style={styles.fournisseur}>Chef: {fournisseur}</MyText>
                    </TouchableOpacity>
                </View>
                <View style={styles.rightTextContainer}>
                    <MyText style={styles.price}>{price} dh</MyText>
                    <AverageRating platId={itemKey} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FF4B3A',
        marginHorizontal: 22,
        marginTop: 5,
        height: 270, // Adjusted height after removing rating input
        width: 350,
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: '70%', // Adjusted height
        resizeMode: 'cover',
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center',
        height: '30%',
    },
    leftTextContainer: {
        flex: 1,
    },
    rightTextContainer: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 19,
        fontFamily: 'Raleway-Bold',
        color: 'white',
    },
    price: {
        color: 'white',
        fontSize: 23,
        marginVertical: 1.5,
        fontFamily: 'Raleway-Bold',
    },
    fournisseur: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Raleway-Bold',
        marginTop: 2,
    },
});

export default FoodCardClient;
