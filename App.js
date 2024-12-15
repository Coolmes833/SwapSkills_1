import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View, Text, Alert, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateYourAccountScreen from './screens/CreateYourAccountScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import Explore from './screens/Explore';
import Chat from './screens/Chat';
import ProfileScreen from './screens/ProfileScreen';



const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="CreateYourAccountScreen" component={CreateYourAccountScreen} />
        <Stack.Screen name="Explore" component={Explore} />
        <Stack.Screen name="Chat" component={Chat} />


      </Stack.Navigator>
    </NavigationContainer>
  );

}

const styles = StyleSheet.create({

});
