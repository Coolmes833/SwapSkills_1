import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Animated
} from 'react-native';

export default function AiHelperWithGPT() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [animatedValue] = useState(new Animated.Value(0));

    const apiKey = "";

    const handleAskGPT = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: input }],
                    temperature: 0.7,
                    max_tokens: 800,
                }),
            });

            const data = await res.json();
            const answer = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'Yanıt alınamadı.';
            setResponse(answer.trim());
        } catch (error) {
            console.error(error);
            setResponse('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };


    const animateTyping = (text) => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < text.length) {
                setResponse((prev) => prev + text[index]);
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 20);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>AI Mentor with ChatGPT</Text>

            <TextInput
                style={styles.input}
                placeholder="Ask me anything (e.g. How to learn Python?)"
                value={input}
                onChangeText={setInput}
                placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.button} onPress={handleAskGPT}>
                <Text style={styles.buttonText}>🧠 Ask Mentor</Text>
            </TouchableOpacity>

            {loading && (
                <View style={styles.loadingWrapper}>
                    <ActivityIndicator size="large" color="#673ab7" />
                    <Text style={styles.typingText}>AI is typing...</Text>
                </View>
            )}

            {response !== '' && (
                <View style={styles.responseContainer}>
                    <Text style={styles.response}>{response}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#3f51b5',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    button: {
        backgroundColor: '#673ab7',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    typingText: {
        marginLeft: 10,
        color: '#555',
        fontStyle: 'italic',
    },
    responseContainer: {
        marginTop: 24,
        backgroundColor: '#e0f2f1',
        padding: 16,
        borderRadius: 12,
    },
    response: {
        fontSize: 16,
        lineHeight: 22,
        color: '#004d40',
    },
});
