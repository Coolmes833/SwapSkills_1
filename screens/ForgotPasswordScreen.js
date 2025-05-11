import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import {
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { auth } from '../fireBase';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        try {
            const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);

            if (!methods || methods.length === 0) {
                // Email might not be registered, but attempt reset anyway for UX purposes
                await sendPasswordResetEmail(auth, normalizedEmail);
                Alert.alert(
                    'Notice',
                    'If your email is registered, a reset link has been sent.'
                );
                navigation.goBack();
                return;
            }

            if (!methods.includes('password')) {
                Alert.alert(
                    'Unsupported Login',
                    'This account uses a different login method (e.g. Google).'
                );
                return;
            }

            await sendPasswordResetEmail(auth, normalizedEmail);
            Alert.alert('Success', 'A reset link has been sent to your email.');
            navigation.goBack();
        } catch (error) {
            console.error('Error:', error.code, error.message);

            let message = 'An unexpected error occurred. Please try again.';
            if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address format.';
            } else if (error.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your internet connection.';
            }

            Alert.alert('Error', message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Your Password</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your registered email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 35,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 15 : 12,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#5cb85c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
    },
    backText: {
        textAlign: 'center',
        color: '#555',
        fontSize: 15,
    },
});
