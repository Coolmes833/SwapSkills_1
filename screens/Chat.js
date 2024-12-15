import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Chat({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chat</Text>

            {/* Chat content will go here */}
            <Text style={styles.chatContent}>This will be your chat screen. More functionality will be added later.</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => alert('Chatting...')}>
                <FontAwesome name="comment" size={24} color="#fff" />
                <Text style={styles.backButtonText}>Start Chat</Text>
            </TouchableOpacity>

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
                <TouchableOpacity style={styles.navItem} onPress={() => {
                    alert("Logging Out")
                    navigation.navigate('WelcomeScreen')
                }}>
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
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    chatContent: {
        fontSize: 16,
        marginBottom: 20,
        color: '#777',
    },
    backButton: {
        backgroundColor: '#4c669f',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        alignItems: 'center',
        flexDirection: 'row',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
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
