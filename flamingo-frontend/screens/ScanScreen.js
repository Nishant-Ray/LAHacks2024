import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
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
import { Ionicons } from "@expo/vector-icons";
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

const ScanScreen = ({ navigation }) => {
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

    const { uid, setUid } = useUser();
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const flipCamera = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const takePhoto = async () => {
        if (cameraRef.current) {
            setIsTakingPhoto(true);
            const photo = await cameraRef.current.takePictureAsync();
            setCapturedPhoto(photo);
            setIsTakingPhoto(false);
        }
    };

    const exitCamera = () => {
        navigation.goBack();
    };

    const acceptPhoto = async () => {
        try {
            const reesponse = await fetch(capturedPhoto.uri);

            const blob = await reesponse.blob();

            const reader = new FileReader();

            reader.onload = async() => {
                const base64String = reader.result;
                console.log("STRING: " + base64String.length);
            
                fetch(`https://plant.id/api/v3/identification`, {
                    method: "POST",
                    body: JSON.stringify({
                        images: [base64String],
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Api-Key": process.env.EXPO_PUBLIC_PLANT_ID_API_KEY,
                    },
                }).then(response => response.json())
                  .then( data => {
                    let plant = data["result"]["classification"]["suggestions"][0]["name"];
                    console.log("NAME: " + plant);
                    navigation.navigate("Result", { plant });
                });
                        
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return (
            <Text
                style={{
                    textAlign: "center",
                    marginTop: 200,
                    fontSize: 26,
                    fontWeight: 700,
                }}
            >
                No access to camera!
            </Text>
        );
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.exitButton}
                        onPress={exitCamera}
                    >
                        <Ionicons name="close" size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={flipCamera}
                    >
                        <Ionicons
                            name="camera-reverse-outline"
                            size={40}
                            color="white"
                        />
                    </TouchableOpacity>
                    {capturedPhoto ? (
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={acceptPhoto}
                            disabled={isTakingPhoto}
                        >
                            <Ionicons
                                style={styles.checkMarkButton}
                                name="send-outline"
                                size={40}
                                color="white"
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePhoto}
                            disabled={isTakingPhoto}
                        >
                            {isTakingPhoto ? (
                                // <View style={styles.captureButtonInner} />
                                <Ionicons
                                    name="camera"
                                    size={40}
                                    color="white"
                                />
                            ) : (
                                <Ionicons
                                    name="camera"
                                    size={40}
                                    color="white"
                                />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </Camera>
            {capturedPhoto && (
                <View style={styles.previewContainer}>
                    <Text style={styles.previewText}>Captured Photo:</Text>
                    <View style={styles.previewImageContainer}>
                        <Image
                            source={{ uri: capturedPhoto.uri }}
                            style={styles.previewImage}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    exitButton: {
        alignSelf: "flex-end",
        alignItems: "center",
        marginBottom: 10,
    },
    flipButton: {
        alignSelf: "flex-end",
        alignItems: "center",
        marginBottom: 10,
    },
    captureButton: {
        alignSelf: "flex-end",
        alignItems: "center",
        marginBottom: 10,
    },
    captureButtonInner: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#fff",
    },
    previewContainer: {
        alignItems: "center",
        padding: 20,
    },
    previewText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    previewImageContainer: {
        width: 200,
        height: 500,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    previewImage: {
        width: "130%",
        height: "100%",
        borderRadius: 10,
    },
    checkMarkButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        paddingVertical: 10,
    },
    bottomRightButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default ScanScreen;
