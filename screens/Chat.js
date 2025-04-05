import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../fireBase';
import { getAuth } from 'firebase/auth';


export default function Chat({ navigation }) {
    const [users, setUsers] = useState([]); // Tüm kullanıcıları tutmak için state

    // Chat odası oluşturma fonksiyonu
    const createChatRoom = async (userId1, userId2) => {
        try {
            const chatId = [userId1, userId2].sort().join('_');
            const chatRef = doc(db, 'chats', chatId);

            const chatSnapshot = await getDoc(chatRef);

            if (!chatSnapshot.exists()) {
                // Chat odası yoksa oluştur
                const chatData = {
                    userIds: [userId1, userId2],
                    createdAt: new Date(),
                };
                await setDoc(chatRef, chatData);
                console.log('Chat room created:', chatId);
            } else {
                console.log('Chat room already exists:', chatId);
            }

            return chatId;
        } catch (error) {
            console.error('Error creating chat room:', error);
            return null;
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
                const auth = getAuth(); // Firebase’in kimlik doğrulama sistemine (auth) eriş.
                const currentUser = auth.currentUser; // Şu anda giriş yapmış olan kullanıcıyı al.
                if (!currentUser) return; // Eğer currentUser yoksa (yani kullanıcı giriş yapmamışsa,fonksiyonu burada durdur!

                const querySnapshot = await getDocs(collection(db, 'users'));

                const usersData = querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter((user) => user.id !== currentUser.uid); // Giriş yapan kullanıcıyı filtrele

                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
                Alert.alert('Error fetching users');
            }
        };

        fetchUsers();
    }, []);


    // Kullanıcıyı seçtiğinizde
    const handleStartChat = async (selectedUser) => {
        try {
            const currentUser = getAuth().currentUser;
            if (!currentUser) return;
            const currentUserId = currentUser.uid;
            const selectedUserId = selectedUser.id;

            const chatId = await createChatRoom(currentUserId, selectedUserId);
            console.log('ChatId:', chatId);

            if (chatId) {
                navigation.navigate('ChatDetail', {
                    chatId,
                    userName: selectedUser.name,
                    currentUserId: currentUserId,
                });
            } else {
                Alert.alert('Chat ID oluşturulamadı!');
            }
        } catch (error) {
            console.error('Chat başlatma hatası:', error);
            Alert.alert('Chat başlatılamadı!');
        }
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
