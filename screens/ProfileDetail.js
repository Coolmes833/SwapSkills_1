// screens/ProfileDetail.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../fireBase';
import { getAuth } from 'firebase/auth';

export default function ProfileDetail({ route, navigation }) {
    const { userId } = route.params;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUserId = getAuth().currentUser?.uid;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const docRef = doc(db, 'users', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUser(docSnap.data());
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleLike = async () => {
        if (!currentUserId || !userId) return;

        const myRef = doc(db, 'likes', currentUserId, 'users', userId);
        const reverseRef = doc(db, 'likes', userId, 'users', currentUserId);

        const existingLike = await getDoc(myRef);
        if (existingLike.exists()) {
            Alert.alert('Already Processed', 'You have already made a decision for this user.');
            return;
        }

        const reverseSnap = await getDoc(reverseRef);

        if (reverseSnap.exists() && reverseSnap.data().status === 'pending') {
            await Promise.all([
                setDoc(myRef, { status: 'matched', timestamp: new Date() }),
                setDoc(reverseRef, { status: 'matched', timestamp: new Date() }),
            ]);
            Alert.alert('Matched!', 'You have a new match!');
        } else {
            await setDoc(myRef, { status: 'pending', timestamp: new Date() });
            Alert.alert('Liked!', 'User has been added to pending list.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>User not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user.profileImage ? (
                <Image source={{ uri: user.profileImage }} style={styles.image} />
            ) : (
                <Text style={styles.initial}>{user.name?.charAt(0) || '?'}</Text>
            )}
            <Text style={styles.name}>{user.name}</Text>

            <View style={styles.infoCard}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{user.description || 'No description provided'}</Text>

                <Text style={styles.label}>Skills:</Text>
                <Text style={styles.value}>
                    {Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || 'No skills listed'}
                </Text>

                <Text style={styles.label}>Wants to Learn:</Text>
                <Text style={styles.value}>
                    {Array.isArray(user.wantToLearn) ? user.wantToLearn.join(', ') : user.wantToLearn || 'No preferences'}
                </Text>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.rejectButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>✗</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={handleLike}>
                    <Text style={styles.buttonText}>✓</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 20,
    },
    initial: {
        fontSize: 64,
        fontWeight: 'bold',
        backgroundColor: '#ccc',
        color: '#fff',
        width: 140,
        height: 140,
        borderRadius: 70,
        textAlign: 'center',
        lineHeight: 140,
        marginBottom: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '100%',
        marginBottom: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 15,
        marginTop: 4,
        color: '#333',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    },
    rejectButton: {
        backgroundColor: '#db4437',
        padding: 15,
        borderRadius: 50,
        width: 60,
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#34a853',
        padding: 15,
        borderRadius: 50,
        width: 60,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
