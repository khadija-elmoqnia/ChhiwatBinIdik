import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import MyText from './MyText';
import { useNavigation } from '@react-navigation/native';
import AverageRating from './AverageRating';

function FoodCardClientOffFourn({ image, title, price, itemKey }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('FoodDetail', { itemKey });
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <Image style={styles.image} source={{ uri: image }} />
            <View style={styles.textContainer}>
                <View style={styles.leftTextContainer}>
                    <MyText numberOfLines={1} style={styles.title}>
                        {title}
                    </MyText>
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
        marginVertical: -3,
        fontFamily: 'Raleway-Bold',
    },
});

export default FoodCardClientOffFourn;
