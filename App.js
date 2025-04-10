import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

// Ekranlar
import CreateYourAccountScreen from './screens/CreateYourAccountScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import Explore from './screens/Explore';
import Chat from './screens/Chat';
import ProfileScreen from './screens/ProfileScreen';
import ChatDetail from './screens/ChatDetail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigatörü (footer)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Chat') {
            iconName = 'comment';
          } else if (route.name === 'Explore') {
            iconName = 'search';
          } else if (route.name === 'SignOut') {
            iconName = 'sign-out';
          }

          return <FontAwesome name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'lightgray',
        tabBarStyle: { backgroundColor: '#555' },
        headerShown: false, // Üstteki başlığı gizle
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="SignOut" component={WelcomeScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Navigasyonu engelle
            Alert.alert('Logging Out');
            navigation.navigate('WelcomeScreen');
          },
        })}
      />
    </Tab.Navigator>
  );
}

// Uygulama Yapısı: Stack içinde Tab'lar
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="CreateYourAccountScreen" component={CreateYourAccountScreen} />
        <Stack.Screen name="ChatDetail" component={ChatDetail} options={{ headerShown: true }} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
