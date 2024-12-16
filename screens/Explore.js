import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { FontAwesome } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../fireBase';

export default function Explore({ navigation }) {
    const swiperRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [cardIndex, setCardIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Veri yüklenme durumunu takip et

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
                Alert.alert('Error', 'Failed to load users.');
            } finally {
                setLoading(false); // Veri yükleme tamamlandı
            }
        };

        fetchUsers();
    }, []);

    const handleSwipeLeft = () => {
        Alert.alert('Rejected', `${users[cardIndex]?.name || 'Unknown User'} has been rejected`);
    };

    const handleSwipeRight = () => {
        Alert.alert('Accepted', `${users[cardIndex]?.name || 'Unknown User'} has been accepted`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Explore Users</Text>

            {/* Yükleniyor durumu */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : users.length > 0 ? (
                <Swiper
                    ref={swiperRef}
                    cards={users}
                    renderCard={(user) =>
                        user ? (
                            <View style={styles.card}>
                                <Text style={styles.cardName}>{user.name || 'Unknown User'}</Text>
                                <Text style={styles.cardSkills}>
                                    {Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || 'No skills listed'}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.card}>
                                <Text style={styles.cardName}>There is no more user!</Text>
                            </View>
                        )
                    }
                    onSwipedLeft={(index) => setCardIndex(index)}
                    onSwipedRight={(index) => setCardIndex(index)}
                    cardIndex={cardIndex}
                    backgroundColor={'#f5f5f5'}
                    stackSize={3}
                    verticalSwipe={false}
                />

            ) : (
                <Text>No users available to explore.</Text>
            )}

            {/* Kabul ve reddetme butonları */}
            {!loading && users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.rejectButton} onPress={handleSwipeLeft}>
                        <FontAwesome name="times" size={30} color="#db4437" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.acceptButton} onPress={handleSwipeRight}>
                        <FontAwesome name="check" size={30} color="#34a853" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Alt navigasyon çubuğu */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProfileScreen')}>
                    <FontAwesome name="user" size={24} color="#fff" />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}>
                    <FontAwesome name="comment" size={24} color="#fff" />
                    <Text style={styles.navText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Explore')}>
                    <FontAwesome name="search" size={24} color="#fff" />
                    <Text style={styles.navText}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => {
                        Alert.alert('Logging Out');
                        navigation.navigate('WelcomeScreen');
                    }}
                >
                    <FontAwesome name="sign-out" size={24} color="#fff" />
                    <Text style={styles.navText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        width: 250,
        height: '40%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 20,
        padding: 20,
        alignSelf: 'center',
    },
    cardName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    cardSkills: {
        fontSize: 16,
        color: '#777',
        marginTop: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20,
        position: 'absolute',
        bottom: 120,
    },
    rejectButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    acceptButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 10,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 5,
    },
});
