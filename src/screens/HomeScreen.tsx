import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, TouchableOpacity, Modal, Dimensions, Text } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { firebase } from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MyView from '../components/MyView';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import firestore from '@react-native-firebase/firestore';
import FoodCardClient from '../components/FoodCardClient';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/panier.png';
import DashboardScreen from './DashboardScreen';

const windowHeight = Dimensions.get('window').height;

function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [plats, setPlats] = useState([]);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);
    const [mostPurchasedPlats, setMostPurchasedPlats] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const getUserData = async (userId) => {
        try {
            const snapshot = await firebase.database().ref('users/' + userId).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
            setCurrentUser(user);
            if (user) {
                const userData = await getUserData(user.uid);
                if (userData) {
                    setUsername(userData.fullName);
                }
            } else {
                setUsername(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
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
        const unsubscribe = firestore()
            .collection('plats')
            .onSnapshot(querySnapshot => {
                const plats = [];
                querySnapshot.forEach(async documentSnapshot => {
                    const platData = documentSnapshot.data();
                    const fournisseurData = await getUserData(platData.fournisseurId);
                    plats.push({
                        ...platData,
                        key: documentSnapshot.id,
                        fournisseur: fournisseurData ? fournisseurData.fullName : 'Unknown',
                        fournisseurId: platData.fournisseurId,
                    });
                });
                setPlats(plats);
            });

        return () => unsubscribe();
    }, []);

    const navigateToDashboard = () => {
        navigation.navigate('Dashboard');
    };

    const toggleDashboard = () => {
        setIsDashboardOpen(!isDashboardOpen);
    };

    const navigateToCart = () => {
        navigation.navigate('cart');
    };

    useEffect(() => {
        if (currentUser) {
            const userCartRef = firestore().collection('carts').where('userId', '==', currentUser.uid);

            const unsubscribe = userCartRef.onSnapshot(snapshot => {
                setNumberOfItemsInCart(snapshot.size);
            });

            return () => unsubscribe();
        } else {
            setNumberOfItemsInCart(0);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchMostPurchasedPlats();
    }, []);

    const fetchMostPurchasedPlats = async () => {
        try {
            const commandesSnapshot = await firestore().collection('commandes').get();
            const platCounts = {};

            commandesSnapshot.forEach(doc => {
                const commandeData = doc.data();
                if (commandeData.items && Array.isArray(commandeData.items)) {
                    commandeData.items.forEach(item => {
                        const { title, quantity, imageURL, price, fournisseurId } = item;
                        if (platCounts[title]) {
                            platCounts[title].count += quantity;
                        } else {
                            platCounts[title] = { count: quantity, imageURL, price, fournisseurId };
                        }
                    });
                }
            });

            const sortedPlats = Object.entries(platCounts).sort((a, b) => b[1].count - a[1].count);
            const topPlats = sortedPlats.slice(0, 7); // Get the top 7 plats

            const mostPurchasedPlats = await Promise.all(topPlats.map(async ([title, data]) => {
                const fournisseurData = await getUserData(data.fournisseurId);
                const platDoc = await firestore().collection('plats').where('title', '==', title).get();
                const platDocId = platDoc.empty ? null : platDoc.docs[0].id;

                return {
                    title,
                    count: data.count,
                    imageURL: data.imageURL,
                    price: data.price,
                    fournisseurId: data.fournisseurId,
                    fournisseur: fournisseurData ? fournisseurData.fullName : 'Unknown',
                    key: platDocId,
                };
            }));

            setMostPurchasedPlats(mostPurchasedPlats);
        } catch (error) {
            console.error('Error getting most purchased plats:', error);
        }
    };

    const handleCategorySelect = (key) => {
        setSelectedCategory(key);
        getPlatsByCategory(key);
    };

    const getPlatsByCategory = async (categoryId) => {
        try {
            const querySnapshot = await firestore()
                .collection('plats')
                .where('categoryId', '==', categoryId)
                .get();

            const plats = await Promise.all(
                querySnapshot.docs.map(async documentSnapshot => {
                    const platData = documentSnapshot.data();
                    const fournisseurData = await getUserData(platData.fournisseurId);
                    return {
                        ...platData,
                        key: documentSnapshot.id,
                        fournisseur: fournisseurData ? fournisseurData.fullName : 'Unknown',
                        fournisseurId: platData.fournisseurId,
                    };
                })
            );

            setPlats(plats);
        } catch (error) {
            console.error('Error fetching plats by category:', error);
        }
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    const handleSearch = (searchResults) => {
        navigation.navigate('SearchResultsPage', { searchResults });
    };

    const navigateToDetails = (item) => {
        navigation.navigate('FoodDetail', { itemKey: item.key });
    };

    return (
        <MyView style={styles.con}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleDashboard} style={styles.dashboardButton}>
                    <Image source={DashboardIcon} style={styles.icon} />
                </TouchableOpacity>

                <Modal visible={isDashboardOpen} transparent={true} animationType="none">
                    <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                            <DashboardScreen onClose={toggleDashboard} navigation={navigation} username={username} />
                        </View>
                    </View>
                </Modal>

                <View style={styles.space}></View>

                <TouchableOpacity onPress={navigateToCart}>
                    <View style={styles.cartContainer}>
                        <Image source={CartIcon} style={styles.icon} />
                        {numberOfItemsInCart > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{numberOfItemsInCart}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
                <View>
                    <MyText style={styles.headerText}>Plat fait maison...{'\n'}Relevé d'une touche marocaine</MyText>
                </View>
                <Search onSearch={handleSearch} />
                <View style={{ height: 50 }}>
                    <FlatList
                        horizontal
                        data={searchResults}
                        renderItem={({ item }) => (
                            <FoodCardClient
                                image={item.imageURL}
                                title={item.title}
                                price={item.price}
                                rate={item.rate}
                                itemKey={item.key}
                                onPress={() => navigateToDetails(item)}
                            />
                        )}
                        keyExtractor={item => item.key}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
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
                {selectedCategory && (
                    <View style={{ marginTop: -68 }}>
                        <MyText style={styles.text}> </MyText>
                        <FlatList
                            vertical
                            data={plats}
                            renderItem={({ item }) => (
                                <FoodCardClient
                                    image={item.imageURL}
                                    title={item.title}
                                    price={item.price}
                                    fournisseur={item.fournisseur}
                                    fournisseurId={item.fournisseurId}
                                    itemKey={item.key}
                                    onPress={() => navigateToDetails(item)}
                                />
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                )}
                {mostPurchasedPlats.length > 0 && (
                    <View style={styles.mostOrderedSection}>
                        <MyText style={styles.headerText}>Les plats les plus populaires</MyText>
                        <FlatList
                            vertical
                            data={mostPurchasedPlats}
                            renderItem={({ item }) => (
                                <FoodCardClient
                                    image={item.imageURL}
                                    title={item.title}
                                    price={item.price}
                                    rate={item.count}
                                    itemKey={item.key}
                                    fournisseur={item.fournisseur}
                                    fournisseurId={item.fournisseurId}
                                    onPress={() => navigateToDetails(item)}
                                />
                            )}
                            keyExtractor={item => item.key}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                )}
            </ScrollView>
        </MyView>
    );
}

const styles = StyleSheet.create({
    alo: {
        marginTop: -20,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    con: {
        backgroundColor: '#E0E0E0',
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
        marginTop: 10,
        backgroundColor: '#E0E0E0',
    },
    space: {
        marginLeft: 'auto',
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    headerText: {
        flex: 1,
        marginLeft: 21,
        fontSize: 22,
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'Raleway-Bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    mostOrderedSection: {
        marginTop: -15,
    },
    modal: {
        backgroundColor: '#FFFFFF',
        width: Dimensions.get('window').width / 2,
        height: '100%',
        width: 300,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        padding: 20,
    },
    cartContainer: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        top: -5,
        right: -5,
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default HomeScreen;