import React, { useState, useEffect } from "react";
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
    Lexend_400Regular,
} from "@expo-google-fonts/dev";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";

const MapScreen = ({ navigation }) => {
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
    const [currentLocation, setCurrentLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    //let markers = [];
    const [initialRegion, setInitialRegion] = useState(null);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log(location.coords);
            setCurrentLocation(location.coords);

            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        };

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user-history`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: uid,
                        }),
                    }
                );
                const data = await response.json();
                console.log("Fetched data:", data);

                if (response.ok) {
                    const history = data["found"];
                    const coords = data["coords"];

                    for (let i = 0; i < coords.length; i++) {
                        const marker = {
                            title: history[i],
                            coordinate: {
                                latitude: coords[i].latitude,
                                longitude: coords[i].longitude,
                            },
                        };
                        console.log(i + " " + history[i]);
                        markers.push(marker);
                        //setMarkers([...markers, marker]);
                        console.log("LEN " + markers.length);
                    }
                    console.log(markers);
                } else {
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getLocation();
        fetchData();
    }, []);

    const home = () => {
        navigation.navigate("Home");
    };

    return (
        <View style={styles.container}>
            <View>
                {initialRegion && (
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={initialRegion}
                        showsUserLocation={true}
                    >
                        {markers.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={marker.coordinate}
                                title={marker.title}
                            />
                        ))}
                    </MapView>
                )}
            </View>

            <Pressable style={styles.homeButton} onPress={home}>
                <Text style={styles.homeButtonText}>Home</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    map: {
        width: "100%",
        height: "90%",
    },
    homeButton: {
        backgroundColor: "#7DEDA1",
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: 140,
        marginTop: 0,
        marginBottom: -20,
        borderRadius: 30,
        alignSelf: "center",
    },
    homeButtonText: {
        fontSize: 20,
        color: "#111210",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Lexend_600SemiBold",
    },
});

export default MapScreen;
