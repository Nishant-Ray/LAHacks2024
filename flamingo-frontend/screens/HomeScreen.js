import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    Pressable,
    LogBox
} from "react-native";
import { Icon } from "react-native-elements";
import { useUser } from "./../UserContext";
import {
    useFonts,
    Urbanist_700Bold,
    Urbanist_600SemiBold,
    Urbanist_500Medium,
    Urbanist_400Regular,
    Lexend_700Bold,
    Lexend_600SemiBold,
    Lexend_500Medium,
    Lexend_400Regular
} from "@expo-google-fonts/dev";

const HomeScreen = ({ navigation }) => {
    let [fontsLoaded, fontError] = useFonts({
        Urbanist_700Bold,
        Urbanist_600SemiBold,
        Urbanist_500Medium,
        Urbanist_400Regular,
        Lexend_700Bold,
        Lexend_600SemiBold,
        Lexend_500Medium,
        Lexend_400Regular
    });

    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();

    const { uid, setUid } = useUser();

    const logout = () => {
        setUid("");
        navigation.navigate("Login");
    };

    const scan = () => {
        navigation.navigate("Scan");
    };

    const log = () => {
        navigation.navigate("Log");
    };

    const map = () => {
        navigation.navigate("Map");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleText}>Vera</Text>
                <Pressable style={styles.logoutButton} onPress={logout}>
                    <Icon
                        name="logout-variant"
                        type="material-community"
                        color="#7DEDA1"
                        size={42}
                    />
                </Pressable>
            </View>
            
            <View style={styles.actionContainer}>

                <View style={styles.actionRow}>
                    <Pressable style={styles.actionButton} onPress={scan}>
                        <Icon
                            name="camera-plus"
                            type="material-community"
                            color="#ffffff"
                            size={50}
                        />
                        <Text style={styles.actionText}>Scan Plant</Text>
                    </Pressable>
                    <Pressable style={[styles.actionButton, { backgroundColor: "#E49066"}]} onPress={log}>
                        <Icon
                            name="sprout"
                            type="material-community"
                            color="#ffffff"
                            size={50}
                        />
                        <Text style={styles.actionText}>Plant Log</Text>
                    </Pressable>
                </View>

                <View style={styles.actionRow}>
                    <Pressable style={[styles.actionButton, { width: 270, backgroundColor: "#E099B3" }]} onPress={map}>
                        <Icon
                            name="map-marker-radius"
                            type="material-community"
                            color="#ffffff"
                            size={50}
                        />
                        <Text style={styles.actionText}>Map History</Text>
                    </Pressable>
                </View>

            </View>
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#111210",
        height: "100%"
    },
    header: {
        alignContent: "flex-start",
        backgroundColor: "#111210",
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Align children vertically
        justifyContent: 'space-between',
    },
    titleText: {
        fontFamily: "Urbanist_700Bold",
        fontSize: 58,
        marginTop: 50,
        marginLeft: 20,
        color: "#7DEDA1",
    },
    logoutButton: {
        marginTop: 50,
        marginRight: 20
    },
    actionContainer: {
        width: "100%",
        alignContent: "flex-start",
        alignItems: "center",
        marginTop: 120
    },
    actionRow: {
        flexDirection: "row",
    },
    actionButton: {
        backgroundColor: "#8C96E4",
        width: 120,
        height: 120,
        borderRadius: 10,
        margin: 15,
        paddingTop: 20,
        alignItems: "center"
    },
    actionText: {
        paddingTop: 10,
        color: "white",
        fontFamily: "Lexend_500Medium"
    }
});

export default HomeScreen;