import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, TouchableOpacity, ScrollView, Button } from 'react-native';
import MyView from '../components/MyView';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import PlatRow from '../components/PlatRow';
import FoodCard from '../components/FoodCard';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/offres.png';

function HomeScreenFournisseur({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [foods, setFoods] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [plats, setPlats] = useState([]);
    const [fournisseurId, setFournisseurId] = useState(null);

    useEffect(() => {
        const fetchFournisseurId = async () => {
            const currentUser = auth().currentUser;
            if (currentUser) {
                setFournisseurId(currentUser.uid);
            }
        };
        fetchFournisseurId();
    }, []);

    useEffect(() => {
        const subscriber = firestore()
            .collection('categories')
            .onSnapshot(querySnapshot => {
                const categories = [];
                querySnapshot.forEach(documentSnapshot => {
                    categories.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setCategories(categories);
                setLoading(false);
            });
        return () => subscriber();
    }, []);

    useEffect(() => {
        const subscriber = firestore().collection("foods").onSnapshot((res) => {
            const foods = [];
            res.forEach(documentSnapshot => {
                foods.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            setFoods(foods);
        });
        return () => subscriber();
    }, []);

    useEffect(() => {
        const subscriber = firestore()
            .collection('promotions')
            .onSnapshot(querySnapshot => {
                const promotions = [];
                querySnapshot.forEach(documentSnapshot => {
                    promotions.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setPromotions(promotions);
                setLoading(false);
            });
        return () => subscriber();
    }, []);

    useEffect(() => {
        if (fournisseurId) {
            const fetchPlats = async () => {
                try {
                    const querySnapshot = await firestore()
                        .collection('plats')
                        .where('fournisseurId', '==', fournisseurId)
                        .get();
                    const plats = [];
                    querySnapshot.forEach(documentSnapshot => {
                        plats.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    });
                    setPlats(plats);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching plats:', error);
                }
            };
            fetchPlats();
        }
    }, [fournisseurId]);

    const getPlatsByCategory = async (categoryId) => {
        try {
            if (fournisseurId) {
                console.log("Fetching plats for category:", categoryId);
                const querySnapshot = await firestore()
                    .collection('plats')
                    .where('categoryId', '==', categoryId)
                    .where('fournisseurId', '==', fournisseurId)
                    .get();

                const plats = [];
                querySnapshot.forEach(documentSnapshot => {
                    plats.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                console.log("Plats fetched for category:", categoryId, plats);
                setPlats(plats);
            }
        } catch (error) {
            console.error('Error fetching plats by category:', error);
        }
    };

    const handleCategorySelect = (key) => {
        console.log("Selected category:", key);
        setSelectedCategory(key);
        if (key === null) {
            fetchPlats();
        } else {
            getPlatsByCategory(key);
        }
    };

    const deletePlat = async (itemId) => {
        try {
            await axios.delete(`http://192.168.1.169:8080/plats/delete?document_id=${itemId}`);
            setPlats((prevPlats) => prevPlats.filter(plat => plat.key !== itemId));
        } catch (error) {
            console.error("Error deleting plat: ", error);
        }
    };

    const updatePlat = async (itemId) => {
        try {
            navigation.navigate('ModifierPlat', { platId: itemId });
        } catch (error) {
            console.error("Erreur lors de la navigation vers le formulaire de modification : ", error);
        }
    };

    const navigateToDashboard = () => {
        navigation.navigate('Dashboard');
    };

    const navigateToCart = () => {
        navigation.navigate('notification');
    };

    const navigateToAddPlat = () => {
        navigation.navigate('AddPlat');
    };

    const navigateToAddCategory = () => {
        navigation.navigate('AddCategory');
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <ScrollView style={styles.scrollView}>
            <MyView style={styles.con}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigateToDashboard}>
                        <Image source={DashboardIcon} style={styles.icon} />
                    </TouchableOpacity>
                    <View style={styles.space}></View>
                    <TouchableOpacity onPress={navigateToCart}>
                        <Image source={CartIcon} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View>
                    <MyText style={styles.headerText}>salam fournisseur</MyText>
                </View>

                <Search />

                <View style={{ height: 50 }}>
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
                <TouchableOpacity onPress={navigateToAddPlat}>
                    <View style={styles.addPlatButton}>
                        <MyText style={styles.addPlatButtonText}>Ajouter DES platS</MyText>
                    </View>
                </TouchableOpacity>

                <View style={{ marginTop: 20 }}>
                    <MyText style={styles.text}>Liste des Plats</MyText>
                    {plats.map(plat => (
                        <PlatRow
                            key={plat.key}
                            plat={plat}
                            onDelete={deletePlat}
                            onUpdate={updatePlat}
                        />
                    ))}
                </View>
                <View style={styles.alo}>
                    <MyText style={styles.text}>Les plus populaires </MyText>
                    <FlatList
                        horizontal
                        data={foods}
                        renderItem={({ item }) => (
                            <FoodCard
                                image={item.imageURL}
                                title={item.title}
                                price={item.price}
                                rate={item.rate}
                                itemKey={item.key}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                    <MyText style={styles.text}>Nos promotions</MyText>
                    <FlatList
                        horizontal
                        data={promotions}
                        renderItem={({ item }) => (
                            <FoodCard
                                image={item.imageURL}
                                title={item.title}
                                price={item.price}
                                rate={item.rate}
                                itemKey={item.key}
                            />
                        )}
                    />
                </View>
            </MyView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    alo: {
        marginTop: -20,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f7f6ff',
    },
    con: {
        backgroundColor: '#F2F2F2',
    },
    text: {
        marginLeft: 21,
        fontSize: 20,
        marginBottom: 3,
        marginTop: 30,
        fontFamily: 'Raleway-Bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    space: {
        marginLeft: 'auto',
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    addPlatButton: {
        backgroundColor: '#FF4B3A',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    addPlatButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
        marginLeft: 21,
        fontSize: 22,
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'Raleway-Bold',
    },
});

export default HomeScreenFournisseur;
