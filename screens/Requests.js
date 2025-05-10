// screens/Requests.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { db } from '../fireBase';
import { doc, getDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';

export default function Requests({ navigation }) {
    const [requests, setRequests] = useState([]);
    const currentUserId = getAuth().currentUser?.uid;

    useEffect(() => {
        if (!currentUserId) return;

        const unsubscribe = onSnapshot(collection(db, 'likes', currentUserId, 'users'), async (snapshot) => {
            const updates = [];

            for (const docSnap of snapshot.docs) {
                const otherUserId = docSnap.id;
                const myStatus = docSnap.data().status;

                if (myStatus !== 'pending') continue; // sadece pending olanlar

                const userRef = doc(db, 'users', otherUserId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    updates.push({
                        id: otherUserId,
                        name: userData.name,
                    });
                }
            }

            setRequests(updates);
        });

        return () => unsubscribe();
    }, [currentUserId]);

    const handleCancelRequest = async (userId) => {
        Alert.alert(
            'Cancel Request',
            'Are you sure you want to cancel this request?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'likes', currentUserId, 'users', userId));
                            Alert.alert('Cancelled', 'Your request has been cancelled.');
                        } catch (error) {
                            console.error('Failed to cancel request:', error);
                            Alert.alert('Error', 'Could not cancel the request.');
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={[styles.userItem, styles.pending]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('ProfileDetail', { userId: item.id, readonly: true })}>
                <View style={styles.userInfo}>
                    <FontAwesome name="user" size={24} color="#fff" />
                    <Text style={styles.userName}>{item.name}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCancelRequest(item.id)}>
                <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Pending Requests</Text>
                <TouchableOpacity onPress={() => Alert.alert('Info', 'These are requests you have sent but not yet matched.')}>
                    <FontAwesome name="question-circle" size={24} color="#888" />
                </TouchableOpacity>
            </View>

            {requests.length > 0 ? (
                <FlatList data={requests} keyExtractor={(item) => item.id} renderItem={renderItem} />
            ) : (
                <Text>No pending requests.</Text>
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    pending: {
        backgroundColor: '#f44336',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        marginLeft: 10,
        fontSize: 18,
        color: '#fff',
    },
    cancelButton: {
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: '#00000033',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        overflow: 'hidden',
    },
});