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
import { useRoute } from '@react-navigation/native';

const DetailsScreen = ({ navigation }) => {
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

    const route = useRoute();
    const { plantName } = route.params;
    const { uid, setUid } = useUser();
    const [ commonName, setCommonName ] = useState("");
    const [ imageLink, setImageLink ] = useState("");

    const log = () => {
        navigation.navigate("Log");
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {

        try {
            let firstWord = plantName.split(' ')[0];

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
                    commonName: plantName,
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

    return (
        <View style={styles.container}>

            <Image
                source={{ uri: imageLink }}
                style={styles.plantImage}
            />
            
            <Text style={styles.plantText}>{commonName}</Text>
            <Text style={styles.scientificNameText}>Scientific Name: <Text style={{ color: "#27b83c", fontSize: 32 }}>{plantName}</Text></Text>
            
            <Pressable style={styles.logButton} onPress={log}>
                <Text style={styles.logButtonText}>Back to Log</Text>
            </Pressable>
        </View>
    );
    
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
    plantText: {
        color: "#27b83c",
        fontFamily: "Urbanist_700Bold",
        fontSize: 50,
        textAlign: "center",
        marginBottom: 20
    },
    scientificNameText: {
        color: "#111210",
        fontFamily: "Urbanist_700Bold",
        fontSize: 32,
        textAlign: "center",
    },
    logButton: {
        backgroundColor: "#7DEDA1",
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 40,
        borderRadius: 30,
        alignSelf: "center",
        marginTop: 150
    },
    logButtonText: {
        fontSize: 20,
        color: "#111210",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Lexend_600SemiBold",
    }
});

export default DetailsScreen;
