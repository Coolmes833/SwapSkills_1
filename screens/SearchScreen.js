import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../fireBase';


export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            const snapshot = await getDocs(collection(db, 'users'));
            const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            const filtered = users.filter((user) => {
                const skills = Array.isArray(user.skills) ? user.skills.join(' ').toLowerCase() : (user.skills || '').toLowerCase();
                return skills.includes(query.toLowerCase());
            });

            setResults(filtered);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
                navigation.navigate('ProfileDetail', { userId: item.id });
            }}
        >
            <Text style={styles.userName}>{item.name || 'Unnamed'}</Text>
            <Text style={styles.skills}>{Array.isArray(item.skills) ? item.skills.join(', ') : item.skills}</Text>
            {item.description && (
                <Text style={styles.skills}>{item.description}</Text>
            )}

        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search by Skill</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter a skill (e.g. React, Cyber)"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>No results yet</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
    },
    userItem: {
        backgroundColor: '#eee',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    skills: {
        fontSize: 14,
        color: '#555',
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});
