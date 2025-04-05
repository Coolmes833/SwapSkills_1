import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../fireBase';


export default function WelcomeScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const handleGoogleSignIn = () => {
        navigation.navigate('MainApp');
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Welcome!', `Successfully logged in as ${userCredential.user.email}`);
            navigation.navigate('MainApp');
        } catch (error) {
            Alert.alert('Sign In Error', `An error occurred: ${error.message}`);
        }
    };

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4c669f" />

            <Image source={require('../assets/logo.webp')} style={styles.image} />
            <Text style={styles.header}>Welcome to SwapSkill Network</Text>

            {/* Giriş Alanları */}
            <View style={styles.inputContainer}>
                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#ddd"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email} // State'i bağladık
                    onChangeText={(text) => setEmail(text)} // State güncelleniyor
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#ddd"
                    secureTextEntry //şifre gizleme
                    value={password} // State'i bağladık
                    onChangeText={(text) => setPassword(text)} // State güncelleniyor

                />
            </View>
            {/* Butonlar */}
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} >
                <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleSignInButton} onPress={handleGoogleSignIn}>
                <Text style={styles.googleSignInButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <Text style={styles.justText}>Do not you have an account ? </Text>
            <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() =>
                    navigation.navigate('CreateYourAccountScreen')
                }
            >
                <Text style={styles.createAccountButtonText}>Create Your Account Now</Text>
            </TouchableOpacity>
        </LinearGradient >
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
        fontSize: 24,
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
    createAccountButton: {
        backgroundColor: '#ff7f50',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    createAccountButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',


    },
    signInButton: {
        backgroundColor: '#333',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    googleSignInButton: {
        backgroundColor: '#4285F4', // Google blue color
        paddingVertical: 15,
        paddingHorizontal: 50,
        marginBottom: 35,
        width: '100%',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
    },
    googleSignInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        height: 300,   // height and width as per you content
        width: '100%',
        marginBottom: 30,
    },
    justText: {
        color: 'white',
        marginBottom: 10,
    }
});
