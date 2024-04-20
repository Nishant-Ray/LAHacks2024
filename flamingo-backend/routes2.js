import express from "express";
import { firebaseApp, database,  } from "./firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { collection, doc,  setDoc, getDoc, updateDoc, arrayUnion  } from "firebase/firestore";

const userRouter = express.Router();
const auth = getAuth(firebaseApp);

