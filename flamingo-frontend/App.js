import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen.js";
import LoginScreen from "./screens/LoginScreen.js";
import SignUpScreen from "./screens/SignUpScreen.js";
import { UserProvider } from "./UserContext.js";
import { LogBox } from "react-native";

const TagConnect = () => {
  return (
    <UserProvider>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </UserProvider>
  );
};

export default Flamingo;