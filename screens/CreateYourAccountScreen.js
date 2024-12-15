import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../fireBase';
import 'firebase/compat/firestore';

export default function CreateYourAccountScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const goBack = () => {
        navigation.navigate("WelcomeScreen");
    }
    const handleSignUp = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            await firestore().collection('users').doc(userId).set({
                name: '',
                email: email,
                skills: [],
                wantToLearn: [],
                createdAt: firestore.FieldValue.serverTimestamp(),
            });



            alert('Thank you for joining us! Now you can log in:', userCredential.user);
            navigation.navigate('WelcomeScreen');

        } catch (error) {
            Alert.alert('Sign Up Error', `An error occurred: ${error.message}`);
        }
    };

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4c669f" />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}


            <Text style={styles.header}>Create Your Account</Text>

            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#ddd"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    autoCapitalize="none"
                    required
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#ddd"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                    required
                />
            </View>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
                <Text style={styles.goBackButtonText}> Go Back</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#ffffff80',
        marginBottom: 15,
        paddingLeft: 15,
        borderRadius: 8,
        fontSize: 16,
        color: '#fff',
        height: 50, // Sabit yükseklik

    },
    signUpButton: {
        backgroundColor: '#ff7f50',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 50,

    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    goBackButton: {
        backgroundColor: '#333',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
    },
    goBackButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});