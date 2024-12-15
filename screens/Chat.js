import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../fireBase';

export default function Chat({ navigation }) {
    const [users, setUsers] = useState([]); // Tüm kullanıcıları tutmak için state

    const createChatRoom = async (userId1, userId2) => {
        try {
            // İki kullanıcı arasında benzersiz bir sohbet odası kimliği oluşturuyoruz
            const chatId = [userId1, userId2].sort().join('_');

            // Sohbet odası verisi
            const chatData = {
                userIds: [userId1, userId2],
                createdAt: new Date(),
            };

            // Sohbet odasını Firestore'da kaydediyoruz
            const chatRef = doc(db, 'chats', chatId);
            await setDoc(chatRef, chatData);

            console.log('Chat room created:', chatId);
            return chatId;
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    const sendMessage = async (chatId, senderId, message) => {
        try {
            const messageData = {
                senderId,
                message,
                createdAt: new Date(),
            };

            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await setDoc(doc(messagesRef), messageData);

            console.log('Message sent:', message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Firestore'dan kullanıcı verilerini çekme
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData); // Kullanıcı verilerini state'e kaydet
            } catch (error) {
                console.error('Error fetching users:', error);
                Alert.alert('Error fetching users');
            }
        };

        fetchUsers();
    }, []);

    // Kullanıcıyı seçtiğinizde
    const handleStartChat = async (selectedUser) => {
        Alert.alert(`Starting chat with ${selectedUser.name}`);
        const currentUser = getAuth().currentUser;
        if (!currentUser) return;
        const currentUserId = currentUser.uid;
        const selectedUserId = selectedUser.id;

        // Kullanıcılar arasında bir sohbet odası oluştur
        const chatId = await createChatRoom(currentUserId, selectedUserId);

        // Sohbet ekranına yönlendir
        navigation.navigate('ChatDetail', { chatId, userName: selectedUser.name });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Other Users</Text>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.userItem}
                        onPress={() => handleStartChat(item)}
                    >
                        <FontAwesome name="user" size={24} color="#4c669f" />
                        <Text style={styles.userName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
            />

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
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    userName: {
        marginLeft: 10,
        fontSize: 18,
        color: '#333',
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
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
