import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { FontAwesome } from '@expo/vector-icons';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../fireBase';

export default function Explore() {
    const swiperRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [cardIndex, setCardIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // 1. Tüm kullanıcıları çek
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // 2. Sadece like (pending veya matched) olanları çek
                const likesSnapshot = await getDocs(collection(db, 'likes', currentUserId, 'users'));
                const likedUserIds = likesSnapshot.docs
                    .filter(doc => {
                        const status = doc.data().status;
                        return status === 'pending' || status === 'matched';
                    })
                    .map(doc => doc.id);

                // 3. Giriş yapan kişi hariç ve beğenilmişleri çıkar
                const filteredUsers = userData.filter(
                    (user) => user.id !== currentUserId && !likedUserIds.includes(user.id)
                );

                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
                Alert.alert('Error', 'Failed to load users.');
            } finally {
                setLoading(false);
            }
        };



        fetchUsers();
    }, [currentUserId]);

    const handleLike = async (likedUserId) => {
        if (!currentUserId || !likedUserId) return;

        const myRef = doc(db, 'likes', currentUserId, 'users', likedUserId);
        const reverseRef = doc(db, 'likes', likedUserId, 'users', currentUserId);

        const reverseSnap = await getDoc(reverseRef);

        if (reverseSnap.exists()) {
            const reverseStatus = reverseSnap.data().status;

            if (reverseStatus === 'pending') {
                // Eşleşme oldu, her iki tarafı matched yap
                await Promise.all([
                    setDoc(myRef, { status: 'matched', timestamp: new Date() }),
                    setDoc(reverseRef, { status: 'matched', timestamp: new Date() }),
                ]);
                Alert.alert('Matched!', 'You have a new match!');
            } else {
                // Karşı taraf seni zaten matched yapmışsa yine eşle
                if (reverseStatus === 'matched') {
                    await setDoc(myRef, { status: 'matched', timestamp: new Date() });
                } else {
                    // İlk like
                    await setDoc(myRef, { status: 'pending', timestamp: new Date() });
                }
            }
        } else {
            // Karşı taraf hiç like atmamış
            await setDoc(myRef, { status: 'pending', timestamp: new Date() });
        }
    };


    const handleSwipeRight = async () => {
        if (cardIndex < users.length) {
            const likedUserId = users[cardIndex]?.id;
            await handleLike(likedUserId);
            swiperRef.current.swipeRight();
        }
    };

    const handleSwipeLeft = () => {
        if (cardIndex < users.length) {
            swiperRef.current.swipeLeft();
        }
    };

    const isOutOfUsers = cardIndex >= users.length;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Explore Users</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : users.length > 0 ? (
                <View style={styles.swiperWrapper} pointerEvents="box-none">
                    <Swiper
                        ref={swiperRef}
                        cards={users}
                        renderCard={(user) =>
                            user ? (
                                <View style={styles.card}>
                                    {user.profileImage ? (
                                        <Image source={{ uri: user.profileImage }} style={styles.cardImage} />
                                    ) : (
                                        <FontAwesome name="user-circle-o" size={100} color="#ccc" />
                                    )}
                                    <Text style={styles.cardName}>{user.name || 'Unnamed User'}</Text>
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
                        cardIndex={cardIndex}
                        backgroundColor={'transparent'}
                        stackSize={3}
                        verticalSwipe={false}
                        containerStyle={{ height: 500 }}
                        cardStyle={{ alignSelf: 'center' }}
                        onSwipedRight={async (index) => {
                            const likedUserId = users[index]?.id;
                            await handleLike(likedUserId);
                            setCardIndex(index + 1);
                        }}
                        onSwipedLeft={(index) => {
                            setCardIndex(index + 1);
                        }}
                    />
                </View>
            ) : (
                <Text>No users available to explore.</Text>
            )}

            {isOutOfUsers && !loading && (
                <View style={styles.outOfUsersContainer}>
                    <Text style={styles.outOfUsersText}>There are no more users to explore!</Text>
                </View>
            )}

            {!loading && users.length > 0 && !isOutOfUsers && (
                <View style={styles.buttonsContainer} pointerEvents="box-none">
                    <TouchableOpacity style={styles.rejectButton} onPress={handleSwipeLeft}>
                        <FontAwesome name="times" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.acceptButton} onPress={handleSwipeRight}>
                        <FontAwesome name="check" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    swiperWrapper: {
        height: 500,
        width: '100%',
        zIndex: 1,
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        width: 300,
        height: 400,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        alignSelf: 'center',
    },
    cardImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    cardName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardSkills: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    outOfUsersContainer: {
        marginTop: 50,
        padding: 20,
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    outOfUsersText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute',
        bottom: 60,
        zIndex: 5,
        pointerEvents: 'box-none',
    },
    rejectButton: {
        backgroundColor: '#db4437',
        padding: 20,
        borderRadius: 50,
        zIndex: 10,
    },
    acceptButton: {
        backgroundColor: '#34a853',
        padding: 20,
        borderRadius: 50,
        zIndex: 10,
    },
}); 