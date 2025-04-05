import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { db } from '../fireBase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '../CloudinaryUpload.js'

export default function ProfileScreen({ navigation }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [userId, setUserId] = useState(null);
    const [profileImage, setProfileImage] = useState(null);


    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserId(currentUser.uid);
        } else {
            console.log('No user is logged in');
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (userId) {
                try {
                    const userRef = doc(db, 'users', userId);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setName(userData.name || '');
                        setDescription(userData.description || '');
                        setSkills(userData.skills || '');
                        setProfileImage(userData.profileImage || null);
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleSave = async () => {
        if (userId && name && description && skills) {
            try {
                const userRef = doc(db, 'users', userId);
                await setDoc(userRef, { name, description, skills, profileImage });
                Alert.alert('Profile saved successfully!');
            } catch (error) {
                console.error('Error saving profile:', error);
                Alert.alert('Error saving profile.');
            }
        } else {
            Alert.alert('Please fill in all fields.');
        }
    };


    const handleImagePick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "You need to allow access to your gallery.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            try {
                const uploadedUrl = await uploadToCloudinary(imageUri);
                setProfileImage(uploadedUrl);
            } catch (error) {
                Alert.alert("Upload failed", "Image could not be uploaded.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>MY PROFILE</Text>

            <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={handleImagePick}
            >
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <FontAwesome name="camera" size={30} color="#000" />
                )}
            </TouchableOpacity>


            <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="My Skills"
                placeholderTextColor="#aaa"
                value={skills}
                onChangeText={setSkills}
                multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} >
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
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
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'cover',
    },


});
