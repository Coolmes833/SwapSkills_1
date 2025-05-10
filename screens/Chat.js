import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { db } from '../fireBase';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';

export default function Chat({ navigation }) {
    const [matches, setMatches] = useState([]);
    const currentUserId = getAuth().currentUser?.uid;

    useEffect(() => {
        if (!currentUserId) return;

        const unsubscribe = onSnapshot(collection(db, 'likes', currentUserId, 'users'), async (snapshot) => {
            const updates = [];

            for (const docSnap of snapshot.docs) {
                const otherUserId = docSnap.id;
                const myStatus = docSnap.data().status;

                // Şimdi karşı tarafın senin hakkındaki kaydını da al
                const reverseRef = doc(db, 'likes', otherUserId, 'users', currentUserId);
                const reverseSnap = await getDoc(reverseRef);
                const reverseStatus = reverseSnap.exists() ? reverseSnap.data().status : null;

                // Kullanıcı bilgilerini çek
                const userRef = doc(db, 'users', otherUserId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    // Eşleşme varsa veya pending'se listeye ekle
                    if (myStatus === 'matched' || myStatus === 'pending') {
                        updates.push({
                            id: otherUserId,
                            name: userData.name,
                            status:
                                myStatus === 'matched' || reverseStatus === 'matched'
                                    ? 'matched'
                                    : 'pending',
                        });
                    }
                }
            }

            setMatches(updates);
        });

        return () => unsubscribe();
    }, [currentUserId]);

    const handleChatPress = (user) => {
        if (user.status !== 'matched') {
            Alert.alert('Pending Match', 'This user has not approved you yet.');
            return;
        }

        const chatId = [currentUserId, user.id].sort().join('_');
        navigation.navigate('ChatDetail', {
            chatId,
            userName: user.name,
            currentUserId: currentUserId,
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.userItem, item.status === 'matched' ? styles.matched : styles.pending]}
            onPress={() => handleChatPress(item)}
        >
            <FontAwesome name="user" size={24} color="#fff" />
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.statusText}>{item.status === 'matched' ? '✓ Matched' : '✗ Pending'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Likes</Text>
            {matches.length > 0 ? (
                <FlatList data={matches} keyExtractor={(item) => item.id} renderItem={renderItem} />
            ) : (
                <Text>No liked users yet.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    matched: {
        backgroundColor: '#4CAF50',
    },
    pending: {
        backgroundColor: '#f44336',
    },
    userName: {
        marginLeft: 10,
        fontSize: 18,
        color: '#fff',
        flex: 1,
    },
    statusText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
});
