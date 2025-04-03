import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { db } from '../fireBase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ChatDetail({ route, navigation }) {
    const { chatId, currentUserId, userName } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const flatListRef = useRef();

    useEffect(() => {
        navigation.setOptions({ title: userName });

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [chatId]);

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;
        try {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, {
                senderId: currentUserId,
                message: inputMessage.trim(),
                createdAt: serverTimestamp(),
            });
            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.senderId === currentUserId ? styles.myMessage : styles.otherMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mesaj yaz..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Gönder</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageContainer: {
        margin: 10,
        padding: 10,
        borderRadius: 8,
        maxWidth: '70%',
    },
    myMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#E5E5E5',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#4c669f',
        paddingHorizontal: 15,
        borderRadius: 20,
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
