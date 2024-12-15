import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use other icons too
import { getAuth } from 'firebase/auth'; // Firebase auth importu
import { saveUserProfile } from '../firebaseFunctions'; // Firebase işlevlerini import et

export default function ProfileScreen({ navigation }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [photo, setPhoto] = useState(null);  // State to hold the photo URI
    const [userId, setUserId] = useState(null); // Kullanıcı ID'sini tutmak için state

    // Kullanıcı ID'sini almak için useEffect kullanıyoruz
    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserId(currentUser.uid);  // Giriş yapan kullanıcının ID'sini state'e kaydediyoruz
        } else {
            console.log('No user is logged in');
        }
    }, []);

    const handleSave = () => {
        if (userId && name && description && skills) {
            saveUserProfile(userId, name, description, skills);  // Firebase'e veriyi kaydediyoruz
            Alert.alert('Profile saved successfully!');
        } else {
            Alert.alert('Please fill in all fields.');
        }
    };

    // Fotoğraf yükleme fonksiyonu (önceki mantık burada olabilir)
    const handlePhotoUpload = async () => {
        // Fotoğraf yükleme işlemi buraya yazılabilir
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

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

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
                    alert("Logging Out");
                    navigation.navigate('WelcomeScreen');
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
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
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
