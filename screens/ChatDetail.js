import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getDocs, collection, query, orderBy, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Firebase Authentication'ı import et
import { db } from '../fireBase';

export default function ChatDetail({ route }) {
    const { chatId, userName } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Sohbet odasındaki mesajları al
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const q = query(
                    collection(db, 'chats', chatId, 'messages'),
                    orderBy('createdAt', 'asc')
                );
                const querySnapshot = await getDocs(q);
                const messagesData = querySnapshot.docs.map(doc => doc.data());
                setMessages(messagesData);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [chatId]);

    // Yeni mesaj gönder
    const sendMessage = async (chatId, senderId, message) => {
        try {
            const messageData = {
                senderId,
                message,
                createdAt: new Date(),
            };

            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, messageData); // addDoc yerine setDoc yerine addDoc kullanılıyor

            console.log('Message sent:', message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSendMessage = async () => {
        const currentUser = getAuth().currentUser;
        if (currentUser && newMessage.trim()) {
            await sendMessage(chatId, currentUser.uid, newMessage);
            setNewMessage(''); // Mesaj gönderildikten sonra inputu temizle
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chat with {userName}</Text>

            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageItem}>
                        <Text style={styles.messageText}>{item.message}</Text>
                    </View>
                )}
            />

            <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message..."
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    messageItem: {
        padding: 10,
        marginBottom: 5,
        backgroundColor: '#e6e6e6',
        borderRadius: 5,
    },
    messageText: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 25,
        padding: 10,
        marginBottom: 10,
    },
    sendButton: {
        backgroundColor: '#4c669f',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
