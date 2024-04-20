import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
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

const LoginScreen = ({ navigation }) => {
    let [fontsLoaded, fontError] = useFonts({
        JosefinSans_700Bold,
        InterTight_600SemiBold,
        InterTight_500Medium,
        InterTight_700Bold,
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { uid, setUid } = useUser();

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
                setUid(data.uid);
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
                <Text style={styles.titleText}>Flamingo</Text>
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
        backgroundColor: "#ffffff",
    },
    header: {
        backgroundColor: "white",
        width: "100%",
        height: 200,
        alignItems: "flex-end",
    },
    titleText: {
        fontFamily: "JosefinSans_700Bold",
        fontSize: 56,
        marginTop: 100,
        color: "#fa6161",
        alignSelf: "center",
    },
    formContainer: {
        backgroundColor: "white",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    formDiv: {
        backgroundColor: "white",
        paddingTop: 50,
        width: "75%",
        alignItems: "left",
    },
    welcomeText: {
        fontSize: 28,
        marginBottom: 20,
        color: "#333330", // Updated text color
    },
    input: {
        height: 60,
        width: "100%",
        backgroundColor: "white",
        color: "#333333",
        paddingHorizontal: 15,
        fontSize: 20,
        backgroundColor: "#ffb8b8",
        borderRadius: 7,
        overflow: "hidden",
        alignSelf: "center",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: "#ffb8b8",
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
    },
    showPasswordButton: {
        paddingRight: 10
    },
    showPasswordText: {
        color: "#1f8df2",
        fontSize: 18,
    },
    loginButton: {
        backgroundColor: "#fa6161",
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: "100%",
        marginTop: 25,
        marginBottom: 40,
        borderRadius: 5,
        backgroundColor: "#fa6161",
        alignSelf: "center",
    },
    loginButtonText: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
    signUpInfo: {
        color: "#333333",
        fontSize: 18,
        alignSelf: "center",
    },
    signUpButton: {
        backgroundColor: "#ffffff",
        alignSelf: "center",
    },
    signUpButtonText: {
        color: "#fa6161",
        textAlign: "center",
        fontSize: 18,
        textDecorationLine: "underline",
    },
});

export default LoginScreen;