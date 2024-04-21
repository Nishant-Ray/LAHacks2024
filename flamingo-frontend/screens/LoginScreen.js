import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
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
    Lexend_400Regular
} from "@expo-google-fonts/dev";

const LoginScreen = ({ navigation }) => {
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

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { uid, setUid } = useUser();
    
    if (!fontsLoaded || fontError) {
        console.log("Error loading fonts");
        return null;
    }

    const handleLogin = async () => {

        if (email == "" || password == "") {
            alert("Please enter an email and password!");
            return;
        }

        // Actual authentication logic using the backend server
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setEmail("");
                setPassword("");
                setUid(data.userId);
                navigation.navigate("Home");
            } else {
                alert("Invalid username or password! Please try again.");
            }
        } catch (error) {
            alert("Server error!");
            console.log(error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigateToSignUp = () => {
        // Navigate to the SignUpScreen
        navigation.navigate("SignUp");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleText}>Vera</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.formDiv}>
                    <Text style={styles.welcomeText}>Welcome Back</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={"gray"}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor={"gray"}
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                        />
                        <Pressable style={styles.showPasswordButton}
                            onPress={togglePasswordVisibility}
                        >
                            <Text style={styles.showPasswordText}>{showPassword ? "Hide" : "Show"}</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </Pressable>

                    <Text style={styles.signUpInfo}>
                        Don't have an account?
                    </Text>

                    <Pressable
                        style={styles.signUpButton}
                        onPress={navigateToSignUp}
                    >
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
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
        marginTop: 20,
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
    loginButton: {
        backgroundColor: "#7DEDA1",
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: "100%",
        marginTop: 25,
        marginBottom: 40,
        borderRadius: 5,
        alignSelf: "center",
    },
    loginButtonText: {
        fontSize: 20,
        color: "#111210",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Lexend_600SemiBold"
    },
    signUpInfo: {
        color: "white",
        fontSize: 18,
        alignSelf: "center",
        fontFamily: "Lexend_400Regular"
    },
    signUpButton: {
        backgroundColor: "#111210",
        alignSelf: "center",
    },
    signUpButtonText: {
        color: "#7DEDA1",
        textAlign: "center",
        fontSize: 18,
        textDecorationLine: "underline",
    },
});

export default LoginScreen;