import express from "express";
import { firebaseApp, database } from "./firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import {
    increment,
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    GeoPoint,
} from "firebase/firestore";
import axios from "axios";
import "dotenv/config";

const API_KEY = process.env.API_KEY;
console.log(API_KEY);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const userRouter = express.Router();
const auth = getAuth(firebaseApp);

// Middleware to get the current user's UID
const getCurrentUserUID = (req, res, next) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            req.currentUserUID = user.userId;
        }
        next();
    });
};

userRouter.post("/signup", async (req, res) => {
    console.log("Signing up");

    const { email, username, password } = req.body;

    if (
        email === undefined ||
        username === undefined ||
        password === undefined
    ) {
        return res.status(401).json({
            success: false,
            message:
                "Missing email, username, and/or password in request body.",
        });
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        // Signed up
        const user = userCredential.user;

        const newUserData = {
            username: username,
            email: email,
            Found: [],
            Coords: [],
            score: 0,
        };

        setDoc(doc(database, "users", user.uid), newUserData);

        return res.status(200).json({
            success: true,
            message: "Signed up successfully!",
            userId: user.uid,
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: error.message });
    }
});
userRouter.post("/login", async (req, res) => {
    console.log("Logging in");

    const { email, password } = req.body;

    if (email === undefined || password === undefined) {
        return res.status(401).json({
            success: false,
            message: "Missing email and/or password in request body.",
        });
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Logged in
            const user = userCredential.user;
            return res.status(200).json({
                success: true,
                message: "Logged in successfully!",
                userId: user.uid,
            });
        })
        .catch((error) => {
            return res
                .status(401)
                .json({ success: false, message: error.message });
        });
});

userRouter.post("/enterPlant", async (req, res) => {
    console.log("entering new plant");
    try {
        console.log(req.body);
        const { userId, plantName, coords } = req.body;

        if (userId === undefined) {
            return res.status(401).json({
                success: false,
                message: "userId is required in request body.",
            });
        }
        console.log(userId);
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res.status(401).json({
                success: false,
                message: "No User Found with that userId",
            });
        }
        console.log(docSnap.data());
        const userData = docSnap.data();
        if (userData.Found.includes(plantName)) {
            return res.status(402).json({
                success: false,
                message: "Plant already found, database unchanged",
            });
        }
        await updateDoc(docRef, {
            Found: arrayUnion(plantName),
            Coords: arrayUnion(new GeoPoint(coords[0], coords[1])),
            score: increment(10),
        });

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: "Error updating database." });
    }
});

// Route to get plant information based on common name
userRouter.post("/plant-info", async (req, res) => {
    const { commonName } = req.body;
    console.log("plant info input: " + commonName);
    try {
        // Call the external API to get plant information
        const response = await axios.get(
            `https://perenual.com/api/species-list?key=${API_KEY}&q=${commonName}`
        );
        res.status(200).json({
            "Scientific Name": response.data["data"][0]["scientific_name"],
            "Other Name": response.data["data"][0]["other_name"],
            "Common Name": response.data["data"][0]["common_name"],
        });
    } catch (error) {
        console.error("Error fetching plant information:", error);
        res.status(500).json({ error: "Failed to fetch plant information" });
    }
});

userRouter.post("/user-history", async (req, res) => {
    const { userId } = req.body;
    try {
        if (userId == undefined) {
            return res.status(401).json({
                success: false,
                message: "userId is required in request body.",
            });
        }
        console.log(userId);
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res.status(401).json({
                success: false,
                message: "No User Found with that userId",
            });
        }
        const userData = docSnap.data();

        return res.status(200).json({
            coords: userData.Coords,
            found: userData.Found,
            score: userData.score,
        });
    } catch (error) {
        console.log(error);
        return res.status(409).json({
            success: false,
            message: "Error retrieving user history",
        });
    }
});

userRouter.post("/getPlantPic", async (req, res) => {
    const { commonName } = req.body;
    try {
        // Call the external API to get plant information
        const response = await axios.get(
            `https://perenual.com/api/species-list?key=${API_KEY}&q=${commonName}`
        );
        //const plantPic = response.data["default_image"]["original_url"];
        //console.log(response.data.data[0]['default_image']['original_url']);

        console.log("get plant pic input: " + commonName);
        const plantPic = response.data.data[0]["default_image"]["original_url"];
        res.status(200).json(plantPic);
    } catch (error) {
        console.error("Error fetching plant picture:", error);
        res.status(500).json({ error: "Failed to fetch plant picture" });
    }
});

export default userRouter;
