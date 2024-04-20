import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    Pressable,
} from "react-native";
import { useUser } from "./../UserContext";
import {
    useFonts,
    JosefinSans_700Bold,
    InterTight_600SemiBold,
    InterTight_500Medium,
    InterTight_700Bold,
} from "@expo-google-fonts/dev";

const SignUpScreen = ({ navigation }) => {
    let [fontsLoaded, fontError] = useFonts({
        JosefinSans_700Bold,
        InterTight_600SemiBold,
        InterTight_500Medium,
        InterTight_700Bold,
    });

    const { uid, setUid } = useUser();

    return (
        <View style={styles.container}>
            <Text>Home screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
});

export default HomeScreen;