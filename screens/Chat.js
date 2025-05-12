import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { db } from '../fireBase';
import { doc, getDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

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
                const timestamp = docSnap.data().timestamp?.toDate();

                if (myStatus !== 'matched') continue;

                const userRef = doc(db, 'users', otherUserId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    updates.push({
                        id: otherUserId,
                        name: userData.name,
                        matchedAt: timestamp,
                    });
                }
            }

            setMatches(updates);
        });

        return () => unsubscribe();
    }, [currentUserId]);

    const handleChatPress = (user) => {
        const chatId = [currentUserId, user.id].sort().join('_');
        navigation.navigate('ChatDetail', {
            chatId,
            userName: user.name,
            currentUserId,
            receiverId: user.id, // <-- Eksik olan parametre eklendi
        });
    };

    const handleUnmatch = (userId) => {
        Alert.alert('Unmatch', 'Are you sure you want to remove this match?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, 'likes', currentUserId, 'users', userId));
                        await deleteDoc(doc(db, 'likes', userId, 'users', currentUserId));
                        Alert.alert('Unmatched', 'You have removed this match.');
                    } catch (error) {
                        console.error('Unmatch error:', error);
                        Alert.alert('Error', 'Failed to unmatch.');
                    }
                },
            },
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity style={styles.cardContent} onPress={() => handleChatPress(item)}>
                <FontAwesome name="user" size={24} color="#fff" style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.userName}>{item.name}</Text>
                    {item.matchedAt && (
                        <Text style={styles.timestamp}>Matched: {item.matchedAt.toLocaleDateString()}</Text>
                    )}
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnmatch(item.id)} style={styles.unmatchButton}>
                <Text style={styles.unmatchText}>Unmatch</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient colors={['#5c83b3', '#3b5998', '#1f2f5a']} style={styles.gradient}>
            <View style={styles.container}>
                <Text style={styles.header}>Your Matches</Text>
                {matches.length > 0 ? (
                    <FlatList data={matches} keyExtractor={(item) => item.id} renderItem={renderItem} />
                ) : (
                    <Text style={styles.emptyText}>No matches yet.</Text>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#3ba55d',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        elevation: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    lastMessage: {
        fontSize: 14,
        color: '#e0f2f1',
        marginTop: 4,
    },
    timestamp: {
        fontSize: 12,
        color: '#c8e6c9',
        marginTop: 2,
    },
    onlineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#00e676',
        marginLeft: 8,
    },
    unmatchButton: {
        backgroundColor: '#ff5252',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    unmatchText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        fontStyle: 'italic',
    },
});