import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Alert, Image, ScrollView, Linking
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { db } from '../fireBase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '../CloudinaryUpload.js';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [skills, setSkills] = useState([]);
    const [urlInput, setUrlInput] = useState('');
    const [urls, setUrls] = useState([]);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [location, setLocation] = useState(null);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [userId, setUserId] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [wantToLearnInput, setWantToLearnInput] = useState('');
    const [wantToLearn, setWantToLearn] = useState([]);
    const [saveFeedback, setSaveFeedback] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) setUserId(currentUser.uid);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            try {
                const ref = doc(db, 'users', userId);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    setName(data.name || '');
                    setDescription(data.description || '');
                    setSkills(Array.isArray(data.skills) ? data.skills : []);
                    setUrls(Array.isArray(data.urls) ? data.urls : []);
                    setAge(data.age || '');
                    setGender(data.gender || '');
                    setLocation(data.location || null);
                    setCity(data.city || '');
                    setCountry(data.country || '');
                    setProfileImage(data.profileImage || null);
                    setWantToLearn(Array.isArray(data.wantToLearn) ? data.wantToLearn : []);
                }
            } catch (err) {
                console.error('Error loading profile:', err);
            }
        };
        fetchProfile();
    }, [userId]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location access is required.');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
        })();
    }, []);
    const handleAddSkill = () => {
        if (skillsInput.trim()) {
            setSkills([...skills, skillsInput.trim()]);
            setSkillsInput('');
        }
    };

    const handleRemoveSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleAddUrl = () => {
        if (urlInput.trim().startsWith('http://') || urlInput.trim().startsWith('https://')) {
            setUrls([...urls, urlInput.trim()]);
            setUrlInput('');
        } else {
            Alert.alert('Invalid URL', 'Link must start with http:// or https://');
        }
    };

    const handleRemoveUrl = (index) => {
        setUrls(urls.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!userId || !name || !description || skills.length === 0) {
            Alert.alert('Please fill in all required fields.');
            return;
        }
        try {
            await setDoc(doc(db, 'users', userId), {
                name,
                description,
                skills,
                urls,
                age,
                gender,
                location,
                city,
                country,
                profileImage,
                wantToLearn,
            });
            setSaveFeedback('✅ Profile updated successfully!');
            setTimeout(() => setSaveFeedback(''), 3000);
        } catch (err) {
            console.error('Save error:', err);
            Alert.alert('Error', 'Failed to save profile.');
        }
    };

    const handleImagePick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission denied', 'Gallery access is required.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            try {
                const uploaded = await uploadToCloudinary(uri);
                setProfileImage(uploaded);
            } catch (e) {
                Alert.alert('Upload failed');
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>MY PROFILE</Text>

            <TouchableOpacity style={styles.profileImageContainer} onPress={handleImagePick}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <FontAwesome name="camera" size={30} color="#000" />
                )}
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={description} onChangeText={setDescription} multiline />

            <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
            <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />
            {/* Skills */}
            <View style={styles.skillInputRow}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Add a skill"
                    value={skillsInput}
                    onChangeText={setSkillsInput}
                    onSubmitEditing={handleAddSkill}
                />
                <TouchableOpacity onPress={handleAddSkill} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
                {skills.map((skill, index) => (
                    <TouchableOpacity key={index} style={styles.tag} onPress={() => handleRemoveSkill(index)}>
                        <Text style={styles.tagText}>{skill} ✕</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Want to Learn */}
            <View style={styles.skillInputRow}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Want to Learn"
                    value={wantToLearnInput}
                    onChangeText={setWantToLearnInput}
                    onSubmitEditing={() => {
                        if (wantToLearnInput.trim()) {
                            setWantToLearn([...wantToLearn, wantToLearnInput.trim()]);
                            setWantToLearnInput('');
                        }
                    }}
                />
                <TouchableOpacity onPress={() => {
                    if (wantToLearnInput.trim()) {
                        setWantToLearn([...wantToLearn, wantToLearnInput.trim()]);
                        setWantToLearnInput('');
                    }
                }} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
                {wantToLearn.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.tag} onPress={() => setWantToLearn(wantToLearn.filter((_, i) => i !== index))}>
                        <Text style={styles.tagText}>{item} ✕</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* URLs */}
            <View style={styles.skillInputRow}>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Add a link (https://...)" value={urlInput} onChangeText={setUrlInput} onSubmitEditing={handleAddUrl} />
                <TouchableOpacity onPress={handleAddUrl} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
                {urls.map((url, index) => (
                    <TouchableOpacity key={index} style={styles.tag} onPress={() => Linking.openURL(url)}>
                        <Text style={styles.tagText}>{url.length > 30 ? url.slice(0, 30) + '...' : url}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
            <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
            </Picker>

            {location && (
                <MapView style={styles.map} region={{ ...location, latitudeDelta: 0.005, longitudeDelta: 0.005 }}>
                    <Marker coordinate={location} title="Your Location" />
                </MapView>
            )}

            {saveFeedback !== '' && <Text style={styles.successText}>{saveFeedback}</Text>}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    profileImageContainer: {
        alignSelf: 'center', marginBottom: 20, width: 120, height: 120, borderRadius: 60,
        backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    profileImage: { width: 120, height: 120, borderRadius: 60 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
    textArea: { height: 100 },
    skillInputRow: { flexDirection: 'row', alignItems: 'center' },
    addButton: { backgroundColor: '#4caf50', padding: 12, borderRadius: 8, marginLeft: 10 },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    tag: { backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
    tagText: { fontSize: 14, color: '#333' },
    picker: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 15 },
    map: { width: '100%', height: 200, marginBottom: 20, borderRadius: 10 },
    saveButton: { backgroundColor: '#4CAF50', paddingVertical: 14, alignItems: 'center', borderRadius: 8 },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    successText: { textAlign: 'center', color: 'green', marginBottom: 15, fontSize: 16 }
});
