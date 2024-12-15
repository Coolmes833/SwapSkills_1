import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use other icons too

export default function ProfileScreen({ navigation }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [photo, setPhoto] = useState(null);  // State to hold the photo URI

    // Handle photo upload (either from gallery or camera)
    const handlePhotoUpload = async () => {
        // Logic for photo upload (same as before)
    };

    return (
        <View style={styles.container}>
            {/* Profile Section */}
            <Text style={styles.header}>MY PROFILE</Text>

            {/* Profile Image */}
            <TouchableOpacity onPress={handlePhotoUpload} style={styles.profileImageContainer}>
                {photo ? (
                    <Image source={{ uri: photo }} style={styles.profileImage} />
                ) : (
                    <FontAwesome name="camera" size={30} color="#000" />
                )}
            </TouchableOpacity>

            {/* Name */}
            <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
            />

            {/* Description */}
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            {/* Skills */}
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="My Skills"
                placeholderTextColor="#aaa"
                value={skills}
                onChangeText={setSkills}
                multiline
            />


            {/* Bottom Navigation Menu */}
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
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
        marginBottom: 20,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 15,
        paddingLeft: 15,
        borderRadius: 8,
        fontSize: 16,
        height: 50,
    },
    textArea: {
        height: 100,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0, // Adjust the bottom spacing to avoid overlap with the Sign Out button
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
    signOutButton: {
        backgroundColor: '#ff5c5c',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 120,
        width: 200,

    },
    signOutText: {
        color: '#fff',
        fontSize: 18,
    },
});
