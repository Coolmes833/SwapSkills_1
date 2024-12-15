import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { FontAwesome } from '@expo/vector-icons';

// Sample data for users in the Explore section
const users = [
    { id: '1', name: 'John Doe', skills: 'React, JavaScript' },
    { id: '2', name: 'Jane Smith', skills: 'Python, Django' },
    { id: '3', name: 'Mike Johnson', skills: 'React Native, Firebase' },
    { id: '4', name: 'Sarah Lee', skills: 'UI/UX Design, Sketch' },
    { id: '5', name: 'Chris Brown', skills: 'JavaScript, Node.js' },
];

export default function Explore({ navigation }) {
    const swiperRef = useRef(null); // Create a reference to the swiper component

    const [cardIndex, setCardIndex] = useState(0); // To track the current card index

    // Handle the action when the user swipes left (rejection)
    const handleSwipeLeft = () => {
        swiperRef.current.swipeLeft(); // Trigger left swipe action
        Alert.alert('Rejected', `${users[cardIndex].name} has been rejected`);
    };

    // Handle the action when the user swipes right (approval)
    const handleSwipeRight = () => {
        swiperRef.current.swipeRight(); // Trigger right swipe action
        Alert.alert('Accepted', `${users[cardIndex].name} has been accepted`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Explore Users</Text>

            <Swiper
                ref={swiperRef} // Assign ref to swiper
                cards={users}
                renderCard={(user) => (
                    <View style={styles.card}>
                        <Text style={styles.cardName}>{user.name}</Text>
                        <Text style={styles.cardSkills}>{user.skills}</Text>
                    </View>
                )}
                onSwipedLeft={(index) => setCardIndex(index)} // Update card index when swiped left
                onSwipedRight={(index) => setCardIndex(index)} // Update card index when swiped right
                cardIndex={cardIndex}
                backgroundColor={'#f5f5f5'}
                stackSize={3} // Number of cards visible at once
                verticalSwipe={false} // Disable vertical swipe
            />

            {/* Approval and Rejection Buttons */}
            <View style={styles.buttonsContainer}>
                {/* Red X Button */}
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={handleSwipeLeft} // Trigger left swipe action
                >
                    <FontAwesome name="times" size={30} color="#db4437" />
                </TouchableOpacity>

                {/* Green Check Button */}
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={handleSwipeRight} // Trigger right swipe action
                >
                    <FontAwesome name="check" size={30} color="#34a853" />
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15, // For rounded corners
        width: 250, // Card width
        height: '40%', // Cards take 40% of the screen height
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 20,
        padding: 20,
        alignSelf: 'center', // Center the card horizontally
    },
    cardName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    cardSkills: {
        fontSize: 16,
        color: '#777',
        marginTop: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20,
        position: 'absolute',
        bottom: 120, // Make sure buttons are above the bottom nav
    },
    rejectButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    acceptButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
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
