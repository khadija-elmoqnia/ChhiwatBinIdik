import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import FoodCardClient from '../components/FoodCardClient';
import MyText from '../components/MyText';
import Category from '../components/Category';

const FournisseurScreen = () => {
    const route = useRoute();
    const { fournisseurId, fournisseurName } = route.params;

    const [plats, setPlats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await firestore().collection('categories').get();
                const categories = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    key: doc.id,
                }));
                setCategories(categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPlats = async () => {
            if (!fournisseurId) {
                console.error('fournisseurId is undefined');
                return;
            }

            try {
                const querySnapshot = await firestore()
                    .collection('plats')
                    .where('fournisseurId', '==', fournisseurId)
                    .get();

                const plats = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    key: doc.id,
                }));

                setPlats(plats);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching plats for fournisseur:', error);
            }
        };

        fetchPlats();
    }, [fournisseurId]);

    const getPlatsByCategory = async (categoryId) => {
        try {
            const querySnapshot = await firestore()
                .collection('plats')
                .where('categoryId', '==', categoryId)
                .where('fournisseurId', '==', fournisseurId)
                .get();

            const plats = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                key: doc.id,
            }));

            setPlats(plats);
        } catch (error) {
            console.error('Error fetching plats by category:', error);
        }
    };

    const handleCategorySelect = (key: string) => {
        setSelectedCategory(key);
        getPlatsByCategory(key);
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            <MyText style={styles.headerText}>Plats de {fournisseurName}</MyText>
            <View style={styles.categoriesContainer}>
                <FlatList
                    horizontal
                    data={categories}
                    renderItem={({ item }) => (
                        <Category
                            title={item.title}
                            itemKey={item.key}
                            isSelected={item.key === selectedCategory}
                            onSelect={handleCategorySelect}
                        />
                    )}
                    keyExtractor={item => item.key}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <FlatList
                data={plats}
                renderItem={({ item }) => (
                    <FoodCardClient
                        image={item.imageURL}
                        title={item.title}
                        price={item.price}
                        fournisseur={item.fournisseurName}
                        fournisseurId={item.fournisseurId}
                        itemKey={item.key}
                    />
                )}
                keyExtractor={item => item.key}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 22,
        fontFamily: 'Raleway-Bold',
        margin: 16,
    },
    categoriesContainer: {
        height: 50,
        marginBottom: 16,
    },
});

export default FournisseurScreen;
