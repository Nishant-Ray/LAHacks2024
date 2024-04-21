import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    Pressable,
    TouchableOpacity,
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
import { useRoute } from '@react-navigation/native';

const ResultScreen = ({ navigation }) => {
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

    const route = useRoute();
    const { plant } = route.params;
    const { uid, setUid } = useUser();
    const [ commonName, setCommonName ] = useState("");
    const [ imageLink, setImageLink ] = useState("");
    const [ alreadyFound, setAlreadyFound ] = useState(false);

    const home = () => {
        navigation.navigate("Home");
    };

    useEffect(() => {
        updateDatabase();
    }, []);
    
    const updateDatabase = async () => {
        console.log("4 " + uid);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/enterPlant`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: uid,
                    plantName: plant,
                    coords: [0, 0]
                }),
            });
            const data = await response.json();
            console.log('Fetched data:', data);

            if (response.status === 402) {
                setAlreadyFound(true);
            } else if (response.ok) {
                setAlreadyFound(false);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

        try {
            let firstWord = plant.split(' ')[0];
            console.log("FIRST WORD: " + firstWord);

            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/plant-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    commonName: firstWord,
                }),
            });
            const data = await response.json();
            console.log('Fetched data:', data);

            if (response.ok) {
                setCommonName(data["Common Name"]);
            } else {
                setCommonName("");
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/getPlantPic`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: uid,
                    commonName: plant,
                }),
            });
            const data = await response.json();
            console.log('Fetched data:', data);

            if (response.ok) {
                setImageLink(data);
            } else {
                setImageLink("");
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (alreadyFound) {
        return (
            <View style={styles.container}>

                <Image
                    source={{ uri: imageLink }}
                    style={styles.plantImage}
                />
                
                <Text style={styles.discoveryText}>You've Already Discovered This Plant!</Text>
                <Text style={styles.plantText}>{commonName}</Text>
                <Text style={styles.scientificNameText}>Scientific Name: <Text style={{ color: "#27b83c", fontSize: 24 }}>{plant}</Text></Text>
                
                <Pressable style={styles.homeButton} onPress={home}>
                    <Text style={styles.homeButtonText}>Home</Text>
                </Pressable>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>

                <Image
                    source={{ uri: imageLink }}
                    style={styles.plantImage}
                />
                
                <Text style={styles.discoveryText}>You Discovered a New Plant!</Text>
                <Text style={styles.plantText}>{commonName}</Text>
                <Text style={styles.scientificNameText}>Scientific Name: <Text style={{ color: "#27b83c", fontSize: 24 }}>{plant}</Text></Text>
                
                <Pressable style={styles.homeButton} onPress={home}>
                    <Text style={styles.homeButtonText}>Home</Text>
                </Pressable>
            </View>
        );
    }
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 100,
        paddingHorizontal: 15
    },
    plantImage: {
        width: 250,
        height: 250,
        borderRadius: 10
    },
    discoveryText: {
        marginTop: 50,
        color: "#111210",
        fontFamily: "Lexend_500Medium",
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    plantText: {
        color: "#27b83c",
        fontFamily: "Urbanist_700Bold",
        fontSize: 50,
        textAlign: "center",
    },
    scientificNameText: {
        color: "#111210",
        fontFamily: "Urbanist_700Bold",
        fontSize: 22,
        textAlign: "center",
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
        marginTop: 150
    },
    homeButtonText: {
        fontSize: 20,
        color: "#111210",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Lexend_600SemiBold",
    }
});

export default ResultScreen;
