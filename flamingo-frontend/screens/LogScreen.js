import React, { useState, useEffect, useRef } from "react";
import {
    View,
    ScrollView,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    LogBox
} from "react-native";
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
    Lexend_400Regular,
} from "@expo-google-fonts/dev";

const LogScreen = ({ navigation }) => {
    let [fontsLoaded, fontError] = useFonts({
        Urbanist_700Bold,
        Urbanist_600SemiBold,
        Urbanist_500Medium,
        Urbanist_400Regular,
        Lexend_700Bold,
        Lexend_600SemiBold,
        Lexend_500Medium,
        Lexend_400Regular,
    });

    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();

    const { uid, setUid } = useUser();
    const [ history, setHistory ] = useState([]);
    const [ score, setScore ] = useState(0);

    const home = () => {
        navigation.navigate("Home");
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user-history`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: uid,
                }),
            });
            const data = await response.json();
            console.log('Fetched data:', data);

            if (response.ok) {
                setHistory(data["found"]);
                setScore(data["score"]);
            } else {
                
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const openDetails = (plantName) => {
        navigation.navigate('Details', { plantName });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Plant Log</Text>
            <ScrollView style={styles.log} contentContainerStyle={styles.scrollViewContent}>
            {history.map((plantName, plantIndex) => (
                <Pressable style={styles.plantCard} onPress={() => openDetails(plantName)}>
                    <Text style={styles.plantText}>{plantName}</Text>
                </Pressable>
            ))}
            </ScrollView>

            <Text style={styles.scoreText}>Score: {score}</Text>

            <Pressable style={styles.homeButton} onPress={home}>
                <Text style={styles.homeButtonText}>Home</Text>
            </Pressable>
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 60
    },
    titleText: {
        fontFamily: "Urbanist_700Bold",
        fontSize: 56,
        color: "#56A923",
        alignSelf: "center",
    },
    log: {
        width: "100%",
        height: "80%",
        marginTop: 20,
        paddingTop: 20,
    },
    scrollViewContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    plantCard: {
        backgroundColor: "#d9d9d9",
        width: "80%",
        height: 80,
        marginBottom: 30,
        borderRadius: 10,
        justifyContent: 'center', // Vertically center content
        alignItems: 'center',     // Horizontally center content
    },
    plantText: {
        color: "#111210",
        fontFamily: "Urbanist_700Bold",
        fontSize: 24,
        textAlign: "center",
    },
    scoreText: {
        fontFamily: "Lexend_600SemiBold",
        fontSize: 24,
        marginTop: 40
    },
    homeButton: {
        backgroundColor: "#7DEDA1",
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: 140,
        marginTop: 25,
        marginBottom: 40,
        borderRadius: 30,
        alignSelf: "center",
    },
    homeButtonText: {
        fontSize: 20,
        color: "#111210",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Lexend_600SemiBold",
    }
});

export default LogScreen;
