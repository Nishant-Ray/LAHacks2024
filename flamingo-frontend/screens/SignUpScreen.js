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

    const [newEmail, setNewEmail] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { uid, setUid } = useUser();

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
                <View style={styles.logoContainer}>
                    <Image source={appLogo} style={styles.logo} />
                </View>
                <Text style={styles.pingoText}>Flamingo</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Create an Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(text) => setNewEmail(text)}
                    value={newEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(text) => setNewUsername(text)}
                    value={newUsername}
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => setNewPassword(text)}
                        value={newPassword}
                    />
                    <Button
                        title={showPassword ? "Hide" : "Show"}
                        onPress={togglePasswordVisibility}
                    />
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
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    header: {
        backgroundColor: "#A9E8BF",
        width: "100%",
        height: 300,
        alignItems: "flex-end",
    },
    logoContainer: {
        width: 40,
        height: 40,
        marginTop: 50,
        marginRight: 30,
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
    },
    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },
    pingoText: {
        fontFamily: "JosefinSans_700Bold",
        fontSize: 80,
        marginTop: 80,
        color: "#1d714a",
        alignSelf: "center",
    },
    formContainer: {
        backgroundColor: "white",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 50,
        width: "100%",
        height: "100%",
    },
    welcomeText: {
        fontFamily: "InterTight_600SemiBold",
        fontSize: 28,
        marginBottom: 20,
        color: "#333330", // Updated text color
    },
    input: {
        height: 60,
        width: "95%",
        borderColor: "#ffffff",
        borderRadius: 5,
        backgroundColor: "#dddddd",
        color: "#333333",
        paddingLeft: 15,
        marginBottom: 20,
        fontSize: 20,
        fontFamily: "InterTight_500Medium",
        overflow: "hidden",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "95%",
        marginBottom: 40,
        borderRadius: 5,
        backgroundColor: "#dddddd",
    },
    passwordInput: {
        flex: 1,
        height: 60,
        paddingLeft: 15,
        color: "#333333",
        fontSize: 20,
        fontFamily: "InterTight_500Medium",
        overflow: "hidden",
    },
    showHideButton: {
        padding: 10,
        backgroundColor: "#27ae60", // Updated button color
        borderRadius: 8,
    },
    buttonText: {
        color: "#ffffff",
    },
    signUpButton: {
        backgroundColor: "#1D714A",
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: "35%",
        borderRadius: 80,
        marginBottom: 40,
    },
    signUpButtonText: {
        fontFamily: "InterTight_700Bold",
        fontSize: 20,
        color: "#ffffff",
        textAlign: "center",
        fontWeight: "bold",
    },
    loginInfo: {
        color: "#333333",
        fontSize: 18,
        fontFamily: "InterTight_600SemiBold",
    },
    loginButton: {
        backgroundColor: "#ffffff",
    },
    loginButtonText: {
        color: "#1D714A",
        textAlign: "center",
        fontSize: 18,
        fontFamily: "InterTight_600SemiBold",
        textDecorationLine: "underline",
    },
});

export default SignUpScreen;