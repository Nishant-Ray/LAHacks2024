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
    Urbanist_700Bold,
    Urbanist_600SemiBold,
    Urbanist_500Medium,
    Urbanist_400Regular,
    Lexend_700Bold,
    Lexend_600SemiBold,
    Lexend_500Medium,
    Lexend_400Regular
} from "@expo-google-fonts/dev";

const SignUpScreen = ({ navigation }) => {
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

    const [newEmail, setNewEmail] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { uid, setUid } = useUser();

    if (!fontsLoaded || fontError) {
        console.log("Error loading fonts");
        return null;
    }

    const handleSignup = async () => {

        if (newEmail == "" || newUsername == "" || newPassword == "") {
            alert("Please enter an email, username, and password!");
            return;
        }

        // Actual authentication logic using the backend server
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: newEmail,
                        username: newUsername,
                        password: newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setNewEmail("");
                setNewUsername("");
                setNewPassword("");
                setUid(data.uid);
                navigation.navigate("Home");
            } else {
                alert("An account with that email already exists!");
            }
        } catch (error) {
            alert("Server error!");
            console.log(error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigateToLogin = () => {
        // Navigate to the SignUpScreen
        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleText}>Vera</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.formDiv}>
                    <Text style={styles.welcomeText}>Create an Account</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={"gray"}
                        onChangeText={(text) => setNewEmail(text)}
                        value={newEmail}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor={"gray"}
                        onChangeText={(text) => setNewUsername(text)}
                        value={newUsername}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor={"gray"}
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => setNewPassword(text)}
                            value={newPassword}
                        />
                        <Pressable style={styles.showPasswordButton}
                            onPress={togglePasswordVisibility}
                        >
                            <Text style={styles.showPasswordText}>{showPassword ? "Hide" : "Show"}</Text>
                        </Pressable>
                    </View>

                    <Pressable style={styles.signUpButton} onPress={handleSignup}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </Pressable>

                    <Text style={styles.loginInfo}>Already have an account?</Text>

                    <Pressable style={styles.loginButton} onPress={navigateToLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    header: {
        backgroundColor: "#111210",
        width: "100%",
        height: 200,
        alignItems: "flex-end",
    },
    titleText: {
        fontFamily: "Urbanist_700Bold",
        fontSize: 72,
        marginTop: 100,
        color: "#7DEDA1",
        alignSelf: "center",
    },
    formContainer: {
        backgroundColor: "#111210",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    formDiv: {
        backgroundColor: "#111210",
        paddingTop: 50,
        width: "75%",
        alignItems: "left",
    },
    welcomeText: {
        fontSize: 28,
        marginBottom: 20,
        color: "white", // Updated text color,
        fontFamily: "Lexend_600SemiBold"
    },
    input: {
        height: 60,
        width: "100%",
        color: "#333333",
        paddingHorizontal: 15,
        fontSize: 20,
        marginBottom: 20,
        backgroundColor: "white",
        borderRadius: 7,
        overflow: "hidden",
        alignSelf: "center",
        fontFamily: "Lexend_400Regular"
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
        backgroundColor: "white",
        borderRadius: 7,
        alignSelf: "center",
    },
    passwordInput: {
        flex: 1,
        height: 60,
        paddingLeft: 15,
        color: "#333333",
        fontSize: 20,
        overflow: "hidden",
        alignSelf: "center",
        fontFamily: "Lexend_400Regular"
    },
    showPasswordButton: {
        paddingRight: 10
    },
    showPasswordText: {
        color: "#3ABA81",
        fontSize: 18,
    },
    signUpButton: {
        backgroundColor: "#7DEDA1",
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: "100%",
        marginTop: 25,
        marginBottom: 40,
        borderRadius: 5,
        alignSelf: "center",
    },
    signUpButtonText: {
        fontSize: 20,
        color: "#111210",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Lexend_600SemiBold"
    },
    loginInfo: {
        color: "white",
        fontSize: 18,
        alignSelf: "center",
        fontFamily: "Lexend_400Regular"
    },
    loginButton: {
        backgroundColor: "#111210",
        alignSelf: "center",
    },
    loginButtonText: {
        color: "#7DEDA1",
        textAlign: "center",
        fontSize: 18,
        textDecorationLine: "underline",
    },
});

export default SignUpScreen;