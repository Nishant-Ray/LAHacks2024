import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen.js";
import LoginScreen from "./screens/LoginScreen.js";
import SignUpScreen from "./screens/SignUpScreen.js";
import ScanScreen from "./screens/ScanScreen.js";
import ResultScreen from "./screens/ResultScreen.js";
import LogScreen from "./screens/LogScreen.js";
import DetailsScreen from "./screens/DetailsScreen.js";
import MapScreen from "./screens/MapScreen.js";
import { UserProvider } from "./UserContext.js";

const Stack = createNativeStackNavigator();

const Flamingo = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Log" component={LogScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Map" component={MapScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default Flamingo;