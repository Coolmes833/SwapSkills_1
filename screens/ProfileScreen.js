// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Alert, Image, Modal, Platform, ActionSheetIOS
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { db } from '../fireBase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '../CloudinaryUpload.js';

export default function ProfileScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [userId, setUserId] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) setUserId(currentUser.uid);
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;
            try {
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setName(data.name || '');
                    setDescription(data.description || '');
                    setSkills(data.skills || '');
                    setProfileImage(data.profileImage || null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserProfile();
    }, [userId]);

    const handleSave = async () => {
        if (!userId || !name || !description || !skills) {
            Alert.alert('Please fill in all fields.');
            return;
        }
        try {
            await setDoc(doc(db, 'users', userId), {
                name,
                description,
                skills,
                profileImage
            });
            Alert.alert('Profile saved successfully!');
        } catch (error) {
            Alert.alert('Error saving profile');
            console.error(error);
        }
    };

    const handleImagePick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission denied", "Gallery access is required.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            try {
                const uploaded = await uploadToCloudinary(imageUri);
                setProfileImage(uploaded);
            } catch (e) {
                Alert.alert("Upload failed");
            }
        }
    };




    const handleImageAction = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Zoom Photo', 'Change Photo', 'Remove Photo', 'Cancel'],
                    cancelButtonIndex: 3,
                    destructiveButtonIndex: 2,
                },
                async (buttonIndex) => {
                    if (buttonIndex === 0) setModalVisible(true);
                    if (buttonIndex === 1) await handleImagePick(); // BURASI async olmalı
                    if (buttonIndex === 2) setProfileImage(null);
                }
            );
        } else {
            Alert.alert('Photo Options', '', [
                {
                    text: 'Zoom Photo',
                    onPress: () => setModalVisible(true),
                },
                {
                    text: 'Change Photo',
                    onPress: async () => {
                        await handleImagePick(); // async olarak çağır
                    },
                },
                {
                    text: 'Remove Photo',
                    onPress: () => setProfileImage(null),
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>MY PROFILE</Text>

            <TouchableOpacity style={styles.profileImageContainer} onPress={handleImageAction}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <FontAwesome name="camera" size={30} color="#000" />
                )}
            </TouchableOpacity>

            {profileImage && (
                <Modal visible={isModalVisible} transparent>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: profileImage }} style={styles.fullScreenImage} resizeMode="contain" />
                    </View>
                </Modal>
            )}

            <TextInput style={styles.input} placeholder="Ad Soyad" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description" placeholderTextColor="#aaa" value={description} onChangeText={setDescription} multiline />
            <TextInput style={[styles.input, styles.textArea]} placeholder="My Skills" placeholderTextColor="#aaa" value={skills} onChangeText={setSkills} multiline />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    profileImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
        marginBottom: 20,
        overflow: 'hidden',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'cover',
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },
    modalCloseText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    },
});
